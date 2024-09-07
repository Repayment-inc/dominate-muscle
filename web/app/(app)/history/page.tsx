"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { ExerciseDialog } from "@/components/workout/ExerciseDialog";
import { useExercises } from "@/hooks/useExercises";
import { useWorkoutEdit } from "@/hooks/useWorkoutEdit";
import { useWorkoutHistory } from "@/hooks/useWorkoutHistory";
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
  DialogTitle,
} from "@/components/ui/dialog";
import { MoreVertical } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";

import { WorkoutHistoryEntry } from "@/types/history";
// import { WorkoutEdit } from "@/types/workoutEditTypes";
import {
  deleteWorkoutHistory,
  fetchWorkoutHistory,
  // updateWorkoutHistory,
} from "@/services/api/workout";

export default function History() {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedWorkout, setselectedWorkout] =
    useState<WorkoutHistoryEntry | null>(null);

  const { workoutHistory, sortOrder, toggleSortOrder, groupedWorkouts } =
    useWorkoutHistory();

  const toggleDialog = () => {
    setDialogOpen(!isDialogOpen);
  };

  const handleCardClick = (workout: WorkoutHistoryEntry) => {
    setselectedWorkout(workout);
    toggleDialog();
  };

  const submitDeleteWorkout = async (date: string) => {
    try {
      await deleteWorkoutHistory(date);
      alert("削除に成功しました");
      await fetchWorkoutHistory();
      window.location.reload();
    } catch (error) {
      alert("エラーが発生しました。もう一度試してください。");
      console.error(error);
    }
  };

  const {
    isEditDialogOpen,
    editWorkout,
    selectedDate,
    isExerciseDialogOpen,
    toggleEditDialog,
    handleEditClick,
    handleDateChange,
    handleSaveEdit,
    handleSetChange,
    handleDeleteSet,
    handleAddSet,
    handleExerciseSelect,
    setEditWorkout,
    setIsExerciseDialogOpen,
    setCurrentEditingExerciseIndex,
  } = useWorkoutEdit();

  const { exercises, loading, error } = useExercises();

  const monthRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // 月のリストを作成
  const monthList = useMemo(() => {
    return Object.keys(groupedWorkouts);
  }, [groupedWorkouts]);

  // 指定した月までスクロールする関数
  const scrollToMonth = (month: string) => {
    monthRefs.current[month]?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) return <p>Loading exercises...</p>;
  if (error) return <p>Error loading exercises: {error}</p>;

  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold leading-none tracking-tight">
          ワークアウト履歴
        </h1>

        <div className="flex">
    
        <div className="my-4 grid w-full justify-center max-w-sm gap-1.5">
          <Button onClick={toggleSortOrder} className="w-40">
            {sortOrder === "desc" ? "↑昇順に並べ替え" : "↓降順に並べ替え"}
          </Button>

          {Object.keys(groupedWorkouts).map((month, monthIndex) => (
            <div
              key={monthIndex}
              className="mb-4"
              ref={(el) => {
                monthRefs.current[month] = el;
              }}
            >
              <h2 className="text-center mb-2">{month}</h2>
              {groupedWorkouts[month].map((entry, index) => (
                <div key={index} className="flex justify-center p-1">
                  <Card
                    onClick={() => handleCardClick(entry)}
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
                        <div key={idx} className="flex items-center gap-2">
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

          {/* デスクトップ版での月リスト */}
          {/* <div className="hidden md:block w-1/4 pl-4 sticky top-0 h-screen overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">月別</h2>
            <ul>
              {monthList.map((month) => (
                <li key={month} className="mb-2">
                  <Button
                    variant="ghost"
                    className="w-full text-left"
                    onClick={() => scrollToMonth(month)}
                  >
                    {month}
                  </Button>
                </li>
              ))}
            </ul>
          </div> */}

          {selectedWorkout && (
            <Dialog open={isDialogOpen} onOpenChange={toggleDialog}>
              <DialogTrigger asChild>
                <span className="sr-only">Workout Dialog</span>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <h3 className="text-center">
                    {selectedWorkout.date} ワークアウト内容
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
                        onClick={() => handleEditClick(selectedWorkout)}
                      >
                        編集
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          if (window.confirm("本当に削除しますか?")) {
                            submitDeleteWorkout(selectedWorkout.date);
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

                {/* {selectedWorkout.map((session, idx) => ( */}
                {/* <div key={idx} className="grid gap-4 py-4"> */}
                <div className="pl-1 font-bold text-xl bg-slate-300 rounded-lg">
                  {selectedWorkout.sessionTitle}
                </div>
                {selectedWorkout.workouts.map((exercise, exIndex) => (
                  <div key={exIndex}>
                    <p className="font-bold">{exercise.exerciseName}</p>
                    {exercise.sets.map((set, setIndex) => (
                      <p className="text-gray-500 text-sm" key={setIndex}>
                        {set.setNumber}set目: {set.weight} kg x {set.reps} 回
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

          {editWorkout && (
            <Dialog open={isEditDialogOpen} onOpenChange={toggleEditDialog}>
              <DialogContent className="overflow-y-scroll max-h-[80vh]">
                <DialogHeader>
                  <DialogTitle className="text-center">
                    ワークアウト編集
                  </DialogTitle>
                </DialogHeader>
                <DialogDescription>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSaveEdit(editWorkout);
                    }}
                  >
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        日付
                      </label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-32 justify-start text-left font-normal pl-0 focus:ring-2 focus:ring-blue-300 focus:outline-none",
                              !selectedDate && "text-muted-foreground"
                            )}
                          >
                            {selectedDate ? (
                              <div className="flex items-center gap-2">
                                <span>
                                  {format(selectedDate, "yyyy-MM-dd")}
                                </span>
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </div>
                            ) : (
                              <span>日付を選択</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleDateChange}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        セッションタイトル
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        value={editWorkout.sessionTitle || ""}
                        onChange={(e) =>
                          setEditWorkout({
                            ...editWorkout,
                            sessionTitle: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    {editWorkout.workouts?.map((exercise, exIndex) => (
                      <div key={exIndex} className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          エクササイズ名
                        </label>
                        <div className="flex items-center mt-1">
                          <input
                            type="text"
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            value={exercise.exerciseName}
                            readOnly
                          />
                          <Button
                            type="button"
                            onClick={() => {
                              setCurrentEditingExerciseIndex(exIndex);
                              setIsExerciseDialogOpen(true);
                            }}
                            className="ml-2"
                          >
                            選択
                          </Button>
                        </div>
                        {exercise.sets.map((set, setIndex) => (
                          <div
                            key={setIndex}
                            className={`flex items-center space-x-2 mt-2 ${
                              set.status === "deleted" ? "opacity-50" : ""
                            }`}
                          >
                            <span className="text-sm">
                              セット {set.setNumber}
                            </span>
                            <input
                              type="number"
                              step="0.01"
                              className="block w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                              value={set.weight}
                              onChange={(e) =>
                                handleSetChange(
                                  exIndex,
                                  setIndex,
                                  "weight",
                                  e.target.value
                                )
                              }
                              disabled={set.status === "deleted"}
                              required
                            />
                            <span className="text-sm">kg</span>
                            <input
                              type="number"
                              className="block w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                              value={set.reps}
                              onChange={(e) =>
                                handleSetChange(
                                  exIndex,
                                  setIndex,
                                  "reps",
                                  e.target.value
                                )
                              }
                              disabled={set.status === "deleted"}
                              required
                            />
                            <span className="text-sm">回</span>
                            <Button
                              type="button"
                              variant={
                                set.status === "deleted"
                                  ? "secondary"
                                  : "destructive"
                              }
                              onClick={() => handleDeleteSet(exIndex, setIndex)}
                            >
                              {set.status === "deleted" ? "復元" : "削除"}
                            </Button>
                            <span className="text-xs text-gray-500">
                              ({set.status})
                            </span>
                          </div>
                        ))}
                        <Button
                          type="button"
                          className="mt-2"
                          onClick={() => handleAddSet(exIndex)}
                        >
                          セット追加
                        </Button>
                      </div>
                    ))}
                    <div className="flex justify-end space-x-2 mt-4">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={toggleEditDialog}
                      >
                        キャンセル
                      </Button>
                      <Button type="submit">保存</Button>
                    </div>
                  </form>
                </DialogDescription>
              </DialogContent>
            </Dialog>
          )}
          <ExerciseDialog
            isOpen={isExerciseDialogOpen}
            onOpenChange={setIsExerciseDialogOpen}
            exercises={exercises}
            onExerciseSelect={handleExerciseSelect}
          />
        </div>

        <div className="w-1/2">
        <div className="hidden md:block w-1/2 pl-4 sticky top-0 h-screen overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">月別</h2>
            <ul>
              {monthList.map((month) => (
                <li key={month} className="mb-2">
                  <Button
                    variant="ghost"
                    className="w-full text-left"
                    onClick={() => scrollToMonth(month)}
                  >
                    {month}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}
