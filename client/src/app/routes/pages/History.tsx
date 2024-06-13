import React, { useState, useEffect } from "react";

import {
  Card,
  CardContent,
  // CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { WorkoutHistoryEntry } from "@/types/workoutHistoryTypes";

const groupByMonth = (workoutHistory: WorkoutHistoryEntry[]) => {
  return workoutHistory.reduce<{ [key: string]: WorkoutHistoryEntry[] }>((acc, workout) => {
    const month = workout.date.slice(0, 7); // YYYY-MM形式
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(workout);
    return acc;
  }, {});
};

const sortWorkouts = (workouts: WorkoutHistoryEntry[], order: 'asc' | 'desc') => {
  return workouts.slice().sort((a, b) => {
    if (order === "desc") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
};

export const History: React.FC = () => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  // const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [selectedWorkout2, setSelectedWorkout2] = useState<WorkoutHistoryEntry | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  // const groupedWorkouts = groupByMonth(
  //   sortWorkouts(workoutHistoryData.workoutHistory, sortOrder),
  // );

  // 履歴データの取得
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutHistoryEntry[]>(
    [],
  );
  useEffect(() => {
    // ローカルストレージからキャッシュされたデータを取得
    const cachedData = localStorage.getItem("workoutHistory");
    if (cachedData) {
      // 取得したデータをオブジェクト形式でースし、workoutHistoryに設定
      const parsedData = JSON.parse(cachedData).workoutHistory;
      setWorkoutHistory(parsedData);
      // console.log(parsedData)
    }
  }, []);

  const groupedWorkouts = groupByMonth(sortWorkouts(workoutHistory, sortOrder));

  console.log(groupedWorkouts);

  // ------------

  const toggleDialog = () => {
    setDialogOpen(!isDialogOpen);
  };

  // ダイアログを開き、ワークアウトの内容を渡す
  // const handleCardClick = (workout) => {
  //   setSelectedWorkout(workout);
  //   toggleDialog();
  // };

  const handleCardClick2 = (workout: WorkoutHistoryEntry) => {
    setSelectedWorkout2(workout);
    toggleDialog();
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "desc" ? "asc" : "desc");
  };

  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold leading-none tracking-tight">
          ワークアウト履歴
        </h1>
        <div className="my-4 grid w-full justify-center max-w-sm gap-1.5">
          <Button onClick={toggleSortOrder} className="w-40">
            {sortOrder === "desc" ? "↑昇順に並べ替え" : "↓降順に並べ替え"}
          </Button>

          {Object.keys(groupedWorkouts).map((month, monthIndex) => (
            <div key={monthIndex} className="mb-4">
              <h2 className="text-center mb-2">{month}</h2>
              {groupedWorkouts[month].map((entry, index) => (
                <div key={index} className="flex justify-center p-1">
                  <Card
                    onClick={() => handleCardClick2(entry)}
                    className="w-[350px] cursor-pointer"
                  >
                    <CardHeader>
                      <CardTitle>{entry.date}</CardTitle>
                    </CardHeader>
                    {entry.workouts.map((workout, idx) => (
                      <div key={idx}>
                        <CardContent>
                          <div className="font-bold">{workout.title}</div>
                          {workout.exercises.map((exercise, exIndex) => (
                            <div
                              key={exIndex}
                              className="flex items-center gap-2 my-1"
                            >
                              <p className="text-gray-500 text-sm">
                                {exercise.exerciseName}
                              </p>
                              <p className="text-gray-500 text-sm">
                                {exercise.sets.length}セット
                              </p>
                            </div>
                          ))}
                        </CardContent>
                      </div>
                    ))}
                  </Card>
                </div>
              ))}
            </div>
          ))}

          {selectedWorkout2 && (
            <Dialog open={isDialogOpen} onOpenChange={toggleDialog}>
              <DialogTrigger asChild>
                <span className="sr-only">Workout Dialog</span>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <h3 className="text-center">
                    {selectedWorkout2.date} ワークアウト内容
                  </h3>
                </DialogHeader>
                <DialogDescription>
                  ワークアウト時間〇〇分 体重〇〇kg (開発予定)
                </DialogDescription>
                {selectedWorkout2.workouts.map((workout, idx) => (
                  <div key={idx} className="grid gap-4 py-4">
                    <div className="pl-1 font-bold text-xl bg-slate-300 rounded-lg">
                      {workout.title}
                    </div>
                    {workout.exercises.map((exercise, exIndex) => (
                      <div key={exIndex}>
                        <p className="font-bold">{exercise.exerciseName}</p>
                        {exercise.sets.map((set, setIndex) => (
                          <p className="text-gray-500 text-sm" key={setIndex}>
                            {set.set_number}set目: {set.weight} kg x {set.reps}{" "}
                            回
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
                <DialogFooter>
                  <Button onClick={toggleDialog}>閉じる</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </>
  );
};

