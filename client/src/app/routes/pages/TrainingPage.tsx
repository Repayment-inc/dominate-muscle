import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import axios from "axios";
import { addWorkout } from "@/hooks/useAPI";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { fetchExercises, fetchWorkoutHistory } from "@/hooks/useAPI"; // APIフックをインポート
import { Table, TableBody, TableRow, TableCell } from "@/components/ui/table";

type Exercise = {
  exerciseId: number;
  exerciseName: string;
  bodyPartId: number;
  bodyPartName: string;
};

type ResultData = {
  exercises: Exercise[];
};

type Set = {
  setNumber: number;
  weight: number;
  reps: number;
};

type SelectedExercise = {
  exerciseId: number;
  exerciseName: string;
  sets: Set[];
};

export const TrainingPage: React.FC = () => {
  const [date, setDate] = useState(""); // 日付の状態を追加
  const [exerciseCount, setExerciseCount] = useState(0);
  const [selectedExercises, setSelectedExercises] = useState<SelectedExercise[]>([
    {
      exerciseId: 0,
      exerciseName: "",
      sets: [{ setNumber: 1, weight: 0.0, reps: 0 }],
    },
  ]);
  const [isDialogOpen, setDialogOpen] = useState(false);

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

  const addSet = (exerciseIndex: number) => {
    const newSelectedExercises = [...selectedExercises];
    newSelectedExercises[exerciseIndex].sets.push({
      setNumber: newSelectedExercises[exerciseIndex].sets.length + 1,
      weight: 0.0,
      reps: 0,
    });
    setSelectedExercises(newSelectedExercises);
  };

  const removeSet = (exerciseIndex: number) => {
    const newSelectedExercises = [...selectedExercises];
    if (newSelectedExercises[exerciseIndex].sets.length > 1) {
      newSelectedExercises[exerciseIndex].sets.pop();
      setSelectedExercises(newSelectedExercises);
    } else {
      alert("最低1セットは必要です。");
    }
  };

  const addExercise = (exerciseId: number, exerciseName: string) => {
    setExerciseCount((prev) => prev + 1);
    setSelectedExercises([
      ...selectedExercises,
      {
        exerciseId: exerciseId,
        exerciseName: exerciseName,
        sets: [{ setNumber: 1, weight: 0.0, reps: 0 }],
      },
    ]);
  };

  const removeExercise = () => {
    // if (exerciseCount > 1) {
    setExerciseCount((prev) => prev - 1);
    const newSelectedExercises = [...selectedExercises];
    newSelectedExercises.pop();
    setSelectedExercises(newSelectedExercises);
    // } else {
    //   alert("最低1種目は必要です。");
    // }
  };

  const handleRowClick = (exerciseId: number, exerciseName: string) => {
    addExercise(exerciseId, exerciseName);
    console.log("exerciseId =" + exerciseId);
    console.log("exerciseName = " + exerciseName);

    setDialogOpen(false);
  };

  const handleSetChange = (
    exerciseIndex: number,
    setIndex: number,
    field: string,
    value: string,
  ) => {
    const newSelectedExercises = [...selectedExercises];
    const currentSet = newSelectedExercises[exerciseIndex].sets[setIndex];

    if (field === "weight") {
      currentSet.weight = parseFloat(value);
    } else if (field === "reps") {
      currentSet.reps = parseFloat(value);
    }

    setSelectedExercises(newSelectedExercises);
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // 日付が入力されていない場合のバリデーション
    if (!date) {
      alert("日付を入力してください。");
      return;
    }

    // 各種目が選択されていない場合のバリデーション
    for (const exercise of selectedExercises) {
      if (!exercise.exerciseId) {
        alert("すべての種目を選択してください。");
        return;
      }
    }

    for (const exercise of selectedExercises) {
      if (!exercise.exerciseId) {
        alert("すべての種目を選択してください。");
        return;
      }
    }

    // exerciseNameを除外したworkoutデータを作成
    const workoutData = selectedExercises.map(({ exerciseId, sets }) => ({
      exerciseId,
      sets: sets.map((set: Set) => ({
        setNumber: set.setNumber,
        reps: set.reps,
        weight: set.weight,
      })),
    }));

    const formData = {
      date,
      workout: workoutData,
    };

    // ワークアウト登録api
    addWorkout(formData);

    // ワークアウト履歴フェッチapi
    fetchWorkoutHistory();
  };

  return (
    <>
      <h1 className="text-2xl font-semibold leading-none tracking-tight">
        ワークアウトを記録する
      </h1>
      <div className="flex w-full max-w-sm justify-start items-center gap-1.5">
        <Label className="w-80 text-left" htmlFor="dateId">
          今日の日付は?
        </Label>
        <Input
          type="date"
          id="dateId"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="日付"
          className="w-[360px]"
        />
      </div>

      <div>
        {[...Array(exerciseCount)].map((_, exerciseIndex) => (
          <div key={exerciseIndex}>
            <div
              className="flex w-full max-w-sm justify-start items-center gap-1.5 border border-blue-400"
              id="exercise"
            >
              <Label className="w-80 text-left">種目は?</Label>
              {/* <div>{`${exerciseIndex}インデックス`}</div> */}
              {/* <Select
                onValueChange={(value) =>
                  handleSelectExercise(exerciseIndex, value)
                }
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="種を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>種目</SelectLabel>
                    <SelectItem value="14">ベンチプレス</SelectItem>
                    <SelectItem value="15">インクラインベンチプレス</SelectItem>
                    <SelectItem value="16">懸垂</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select> */}

              <div className="flex flex-col w-[1000px]">
                <div>{`${selectedExercises[exerciseIndex].exerciseName}だよ`}</div>

                <div>
                  {selectedExercises[exerciseIndex].sets.map(
                    (set, setIndex) => (
                      <div
                        key={setIndex}
                        className="flex items-center my-2"
                        id="set"
                      >
                        <Label>{`${set.setNumber}セット目`}</Label>
                        <Input
                          type="number"
                          className="w-20"
                          placeholder="kg"
                          value={set.weight}
                          onChange={(e) =>
                            handleSetChange(
                              exerciseIndex,
                              setIndex,
                              "weight",
                              e.target.value,
                            )
                          }
                        />
                        <div>kg</div>
                        <Input
                          type="number"
                          className="w-20"
                          placeholder="Rep数"
                          value={set.reps}
                          onChange={(e) =>
                            handleSetChange(
                              exerciseIndex,
                              setIndex,
                              "reps",
                              e.target.value,
                            )
                          }
                        />
                        <div>Rep</div>
                      </div>
                    ),
                  )}
                </div>
                <Button onClick={() => addSet(exerciseIndex)}>+</Button>
                <Button onClick={() => removeSet(exerciseIndex)}>-</Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-10">
        {/* <Button onClick={addExercise}>次の種目へ</Button> */}
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>エクササイズを追加</Button>
          </DialogTrigger>
          <DialogContent className="overflow-y-auto -bottom-20">
            <DialogHeader>
              <DialogTitle>エクササイズ選択</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              下記からエクササイズを選択してください。
            </DialogDescription>
            <Table>
              <TableBody>
                {exercises.map((exercise, index) => (
                  <TableRow
                    key={`${exercise.exerciseId}-${index}`}
                    onClick={() =>
                      handleRowClick(
                        // exerciseIndex,
                        exercise.exerciseId,
                        exercise.exerciseName,
                      )
                    }
                    className="cursor-pointer"
                  >
                    <TableCell className="font-medium text-center py-0">
                      <div className="h-10 rounded-full bg-sky-100 flex items-center justify-center">
                        {exercise.bodyPartName}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {/* {exercise.exerciseId} */}
                      {exercise.exerciseName}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <DialogFooter>
              <Button onClick={() => setDialogOpen(false)}>閉じる</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button onClick={removeExercise}>種目を削除</Button>
      </div>
      <Button onClick={handleSubmit}>送信</Button>
    </>
  );
};
