"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExerciseDialog } from "@/components/workout/ExerciseDialog";
import { useExercises } from "@/hooks/useExercises";
import { useWorkout } from "@/hooks/useWorkout";
import WeightPicker from "@/components/workout/WeightPicker";
import { Card } from "@/components/ui/card";
import RepPicker from "@/components/workout/RepPicker";

export default function WorkoutPage() {
  const { exercises, loading, error } = useExercises();
  const {
    date,
    setDate,
    exerciseCount,
    selectedExercises,
    isDialogOpen,
    setDialogOpen,
    addExercise,
    addSet,
    removeSet,
    removeExercise,
    handleSetChange,
    handleSubmit,
    sessionTitle,
    setSessionTitle,
  } = useWorkout();

  const handleRowClick = (exerciseId: number, exerciseName: string) => {
    addExercise(exerciseId, exerciseName);
    setDialogOpen(false);
  };

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>{error}</p>;
  }

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
      <div className="flex w-full max-w-sm justify-start items-center gap-1.5">
        <Label className="w-80 text-left" htmlFor="sessionTitleId">
          セッションタイトルは?
        </Label>
        <Input
          type="text"
          id="sessionTitleId"
          value={sessionTitle}
          onChange={(e) => setSessionTitle(e.target.value)}
          placeholder="セッションタイトル"
          className="w-[360px]"
        />
      </div>

      <Card>
        {[...Array(exerciseCount)].map((_, exerciseIndex) => (
          <div key={exerciseIndex}>
            <div
              className="flex w-full max-w-sm justify-start items-center gap-1.5"
              id="exercise"
            >
              <Label className="w-80 text-left">種目は?</Label>

              <div className="flex flex-col w-[800px]">
                <div>{`${selectedExercises[exerciseIndex].exerciseName}`}</div>

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
                              e.target.value
                            )
                          }
                        />
                        {/* <WeightPicker
                          value={set.weight.toString()}
                          onChange={(value) =>
                            handleSetChange(
                              exerciseIndex,
                              setIndex,
                              "weight",
                              value
                            )
                          }
                        /> */}
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
                              e.target.value
                            )
                          }
                        />
                        {/* <RepPicker
                          value={set.reps.toString()}
                          onChange={(value) =>
                            handleSetChange(
                              exerciseIndex,
                              setIndex,
                              "reps",
                              value
                            )
                          }
                        /> */}
                        <div>Rep</div>
                      </div>
                    )
                  )}
                </div>
                <div className="flex justify-center gap-1">
                  <Button onClick={() => addSet(exerciseIndex)}>+</Button>
                  <Button onClick={() => removeSet(exerciseIndex)}>-</Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Card>

      <div className="flex justify-center gap-10">
        <Button onClick={() => setDialogOpen(true)}>エクササイズを選択</Button>

        <ExerciseDialog
          isOpen={isDialogOpen}
          onOpenChange={setDialogOpen}
          exercises={exercises}
          onExerciseSelect={handleRowClick}
        />
        <Button onClick={removeExercise}>種目を削除</Button>
      </div>
      <div className="flex justify-center gap-10">

      <Button className="w-60" onClick={handleSubmit}>送信</Button>
      </div>
    </>
  );
}
