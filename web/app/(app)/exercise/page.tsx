'use client'
import React, { useState, useEffect } from "react";
import {
  Drawer,
  DrawerHeader,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer";

import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";

import { Workouts } from "@/types/workout";
import { fetchExercises } from "@/services/api/exercise";

type Set = {
  setNumber: number;
  weight: string;
  reps: number;
};

type Exercise = {
  exerciseId: number;
  exerciseName: string;
  bodyPartId: number;
  bodyPartName: string;
};

type ResultData = {
  exercises: Exercise[];
};

type SelectedExerciseHistory = {
  date: string;
  exercise: Set[];
};

export default function Exercises() {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null,
  );
  const [selectedExerciseHistory, setSelectedExerciseHistory] = useState<
    SelectedExerciseHistory[]
  >([]);

  // 履歴データの取得
  const [workoutHistory, setWorkoutHistory] = useState<Workouts[]>(
    [],
  );
  useEffect(() => {
    // ローカルストレージからキャッシュされたデータを取得
    const cachedData = localStorage.getItem("workoutHistory");
    if (cachedData) {
      // 取得したデータをオブジェクト形式でパースし、workoutHistoryに設定
      const parsedData = JSON.parse(cachedData).workoutHistory;
      setWorkoutHistory(parsedData);
    }
  }, []);

  const toggleDrawer = (isOpen: boolean) => {
    setDrawerOpen(isOpen);
    if (!isOpen) {
      setSelectedExercise(null);
      setSelectedExerciseHistory([]);
    }
  };
  const handleRowClick = (exercise: Exercise) => {
    console.log("handlerow click" + exercise);
    setSelectedExercise(exercise);
    const history = getSelectedExerciseHistory(exercise.exerciseId);
    console.log("get history result " + history);
    setSelectedExerciseHistory(history);
    setDrawerOpen(true);
  };

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadExercises = async () => {
      try {
        const resultData: ResultData | null = await fetchExercises();
        if (resultData) {
          setExercises(resultData.exercises);
        } else {
          setError("Failed to load exercises");
        }
      } catch (error) {
        setError("Failed to load exercises");
      } finally {
        setLoading(false);
      }
    };

    loadExercises();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  // 選択したエクササイズの履歴を取得
  const getSelectedExerciseHistory = (
    exerciseId: number,
  ): SelectedExerciseHistory[] => {
    const selectedExerciseHistory: SelectedExerciseHistory[] = [];

    workoutHistory.forEach((entry) => {
      entry.workouts.forEach((workout) => {
        workout.sets.forEach((set) => {
          if (exerciseId === exerciseId) {
            selectedExerciseHistory.push({
              date: entry.date,
              exercise: workout.sets,
            });
          }
        });
      });
    });
    return selectedExerciseHistory;
  };

  return (
    <>
      <h1 className="text-2xl font-semibold leading-none tracking-tight">
        エクササイズ一覧
      </h1>
      <Table>
        <TableBody>
          {workoutHistory !== null ? (
            exercises.map((exercise, index) => (
              <TableRow
                key={`${exercise.exerciseId}-${index}`}
                onClick={() => handleRowClick(exercise)}
                className="cursor-pointer"
              >
                <TableCell className="font-medium text-center py-0">
                  <div className="h-10 rounded-full bg-sky-100 flex items-center justify-center">
                    {exercise.bodyPartName}
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  {exercise.exerciseName}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <p>エクササイズ一覧が取得できませんでした</p>
          )}
        </TableBody>
      </Table>

      {selectedExercise && (
        <Drawer open={isDrawerOpen} onOpenChange={toggleDrawer}>
          <DrawerContent side="right">
            <DrawerHeader>
              <DrawerTitle>エクササイズ履歴</DrawerTitle>
              <DrawerDescription>
                {selectedExercise.exerciseName}
              </DrawerDescription>
            </DrawerHeader>
            <div>
              {selectedExerciseHistory.length === 0 ? (
                <p>履歴がありません</p>
              ) : (
                selectedExerciseHistory.map((history, index) => (
                  <div key={index}>
                    <p>日付: {history.date}</p>
                    {history.exercise.map((set, setIndex) => (
                      <p key={setIndex}>
                        セット {set.setNumber}: 重量 {set.weight} kg, 回数{" "}
                        {set.reps}
                      </p>
                    ))}
                  </div>
                ))
              )}
            </div>
            <DrawerClose className="absolute top-4 right-4">
              <span className="sr-only">Close</span>
            </DrawerClose>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};
