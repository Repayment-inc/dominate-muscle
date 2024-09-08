// src/hooks/useWorkoutEdit.ts
import { useState } from "react";
import { WorkoutHistoryEntry } from "@/types/history";
import { fetchWorkoutHistory, updateWorkoutHistory } from "@/services/api/workout";
import { format } from "date-fns";

export const useWorkoutEdit = () => {
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [editWorkout, setEditWorkout] = useState<WorkoutHistoryEntry | null>(
    null,
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isExerciseDialogOpen, setIsExerciseDialogOpen] = useState(false);
  const [currentEditingExerciseIndex, setCurrentEditingExerciseIndex] =
    useState<number | null>(null);

  const toggleEditDialog = () => {
    setEditDialogOpen(!isEditDialogOpen);
  };

  const handleEditClick = (workout: WorkoutHistoryEntry) => {
    const initializedWorkout = {
      ...workout,
      workouts:
        workout.workouts?.map((exercise) => ({
          ...exercise,
          sets: exercise.sets.map((set) => ({
            ...set,
            status: "unchanged" as const,
          })),
        })) || [],
    };
    setEditWorkout(initializedWorkout);
    setSelectedDate(new Date(workout.date)); // 日付を設定
    toggleEditDialog();
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date && editWorkout) {
      setEditWorkout({
        ...editWorkout,
        date: format(date, "yyyy-MM-dd"),
      });
    }
  };

  const handleSaveEdit = async (updatedWorkout: WorkoutHistoryEntry) => {
    if (!updatedWorkout.workouts) return;

    const formattedWorkout = {
      sessionId: updatedWorkout.sessionId,
      date: updatedWorkout.date,
      sessionTitle: updatedWorkout.sessionTitle,
      workouts: updatedWorkout.workouts.map((exercise) => ({
        exerciseId: exercise.exerciseId,
        // exerciseName: exercise.exerciseName,
        sets: exercise.sets
          .filter((set) => set.status !== "deleted")
          .map((set) => ({
            setId: set.setId || 0,
            setNumber: set.setNumber,
            weight: parseFloat(set.weight), // 文字列を数値に変換
            reps: set.reps,
            status: set.status || "unchanged",
          })),
      })),
    };

    try {
      // console.log("formattedWorkout:", formattedWorkout);
      await updateWorkoutHistory(formattedWorkout);
      console.log("更新に成功しましたww");
      alert("更新に成功しました");
      toggleEditDialog();

      console.log("更新に成功しましたtoggleEditDialogw");
      // ローカルストレージを更新
      await fetchWorkoutHistory();
      window.location.reload();
    } catch (error) {
      alert("エラーが発生しました。もう一度試してください。");
      console.error(error);
    }
  };

  const handleSetChange = (
    exIndex: number,
    setIndex: number,
    field: "weight" | "reps",
    value: string | number,
  ) => {
    if (!editWorkout || !editWorkout.workouts) return;

    const updatedWorkout = { ...editWorkout };
    const set = updatedWorkout.workouts[exIndex].sets[setIndex];
    if (field === "weight") {
      set.weight = typeof value === "string" ? value : value.toFixed(2);
    } else if (field === "reps") {
      set.reps = typeof value === "string" ? parseInt(value, 10) : value;
    }
    set.status = set.status === "new" ? "new" : "updated";
    setEditWorkout(updatedWorkout);
  };

  const handleDeleteSet = (exIndex: number, setIndex: number) => {
    if (!editWorkout || !editWorkout.workouts) return;

    const updatedWorkout = { ...editWorkout };
    const set = updatedWorkout.workouts[exIndex].sets[setIndex];
    if (set.status === "new") {
      // 新規追加されたセットの場合は完全に削除
      updatedWorkout.workouts[exIndex].sets.splice(setIndex, 1);
    } else if (set.status === "deleted") {
      // 削除されたセットを復元
      set.status = "unchanged";
    } else {
      // それ以外の場合は削除状態に
      set.status = "deleted";
    }
    setEditWorkout(updatedWorkout);
  };

  const handleAddSet = (exIndex: number) => {
    if (!editWorkout || !editWorkout.workouts) return;

    const updatedWorkout = { ...editWorkout };
    const newSetNumber = updatedWorkout.workouts[exIndex].sets.length + 1;
    updatedWorkout.workouts[exIndex].sets.push({
      setNumber: newSetNumber,
      weight: "0.00",
      reps: 0,
      status: "new" as const,
    });
    setEditWorkout(updatedWorkout);
  };

  const handleExerciseSelect = (exerciseId: number, exerciseName: string) => {
    if (currentEditingExerciseIndex !== null && editWorkout) {
      const updatedWorkouts = [...editWorkout.workouts];
      updatedWorkouts[currentEditingExerciseIndex] = {
        ...updatedWorkouts[currentEditingExerciseIndex],
        exerciseId,
        exerciseName,
      };
      setEditWorkout({
        ...editWorkout,
        workouts: updatedWorkouts,
      });
      setIsExerciseDialogOpen(false);
      setCurrentEditingExerciseIndex(null);
    }
  };

  return {
    isEditDialogOpen,
    editWorkout,
    selectedDate,
    isExerciseDialogOpen,
    currentEditingExerciseIndex,
    toggleEditDialog,
    handleEditClick,
    handleDateChange,
    handleSaveEdit,
    handleSetChange,
    handleDeleteSet,
    handleAddSet,
    handleExerciseSelect,
    setEditDialogOpen,
    setEditWorkout,
    setSelectedDate,
    setIsExerciseDialogOpen,
    setCurrentEditingExerciseIndex,
  };
};
