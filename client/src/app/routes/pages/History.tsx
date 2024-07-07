import React, { useState, useEffect } from "react";

import {
  Card,
  CardContent,
  CardDescription,
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
import { MoreVertical } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Button } from "@/components/ui/button";

import { WorkoutHistoryEntry } from "@/types/workoutHistoryTypes";
import { deleteWorkoutHistory, fetchWorkoutHistory } from "@/hooks/useAPI";

const groupByMonth = (workoutHistory: WorkoutHistoryEntry[]) => {
  return workoutHistory.reduce<{ [key: string]: WorkoutHistoryEntry[] }>(
    (acc, workout) => {
      const month = workout.date.slice(0, 7); // YYYY-MM形式
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(workout);
      return acc;
    },
    {},
  );
};

const sortWorkouts = (
  workouts: WorkoutHistoryEntry[],
  order: "asc" | "desc",
) => {
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
  const [selectedWorkout2, setSelectedWorkout2] =
    useState<WorkoutHistoryEntry | null>(null);
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

  const submitDeleteWorkout = async (date: string) => {
    try {
      await deleteWorkoutHistory(date);
      alert("削除に成功しました")
      await fetchWorkoutHistory();
      window.location.reload();
    } catch (error) {
      alert("エラーが発生しました。もう一度試してください。");
      console.error(error);
    }
  }


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
                      <CardDescription>
                        <div className="font-bold">{entry.sessionTitle}</div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>

                    {entry.workouts.map((workout, idx) => (
                      // <div >
                        <div
                        key={idx}      
                        className="flex items-center gap-2"
                            >
                              <p className="text-gray-500 text-sm">
                                {workout.exerciseName}
                              </p>
                              <p className="text-gray-500 text-sm">
                                {workout.sets.length}セット
                              </p>
                            </div>
                    ))}
                        </CardContent>
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
                {/* 履歴編集ボタン */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer">
                        <MoreVertical className="h-6 w-6" />
                        <span className="sr-only">edit</span>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-30" align="end">
                      <Button
                        variant="outline"
                      >
                        編集
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          if (window.confirm("本当に削除しますか?")) {
                            submitDeleteWorkout(selectedWorkout2.date);
                          }
                        }}
                      >
                        削除
                      </Button>
                    </PopoverContent>
                  </Popover>
                </DialogHeader>
                <DialogDescription>
                  ワークアウト時間〇〇分 体重〇〇kg (開発予定)
                </DialogDescription>
                
                {/* {selectedWorkout2.map((session, idx) => ( */}
                  {/* <div key={idx} className="grid gap-4 py-4"> */}
                    <div className="pl-1 font-bold text-xl bg-slate-300 rounded-lg">
                      {selectedWorkout2.sessionTitle}
                    </div>
                    {selectedWorkout2.workouts.map((exercise, exIndex) => (
                      <div key={exIndex}>
                        <p className="font-bold">{exercise.exerciseName}</p>
                        {exercise.sets.map((set, setIndex) => (
                          <p className="text-gray-500 text-sm" key={setIndex}>
                            {set.setNumber}set目: {set.weight} kg x {set.reps}{" "}
                            回
                          </p>
                        ))}
                      </div>
                    ))}
                  {/* </div> */}
                {/* ))} */}
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
