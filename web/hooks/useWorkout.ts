import { useState } from "react";
import { addWorkout, fetchWorkoutHistory } from "@/services/api/workout";

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

export const useWorkout = () => {
  const [date, setDate] = useState(""); // 日付の状態を追加
  const [sessionTitle, setSessionTitle] = useState(""); // 追加
  const [exerciseCount, setExerciseCount] = useState(0);
  const [selectedExercises, setSelectedExercises] = useState<
    SelectedExercise[]
  >([]);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const addExercise = (exerciseId: number, exerciseName: string) => {
    setSelectedExercises([
      ...selectedExercises,
      {
        exerciseId,
        exerciseName,
        sets: [{ setNumber: 1, weight: 0.0, reps: 0 }],
      },
    ]);
    setExerciseCount((prev) => prev + 1);
  };

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

  const removeExercise = () => {
    setExerciseCount((prev) => prev - 1);
    const newSelectedExercises = [...selectedExercises];
    newSelectedExercises.pop();
    setSelectedExercises(newSelectedExercises);
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

  const handleSubmit = async () => {
    if (!date) {
      alert("日付を入力してください。");
      return;
    }

    if (!sessionTitle) {
      alert("セッションタイトルを入力してください。");
      return;
    }

    for (const exercise of selectedExercises) {
      if (!exercise.exerciseId) {
        alert("すべての種目を選択してください。");
        return;
      }
    }

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
      sessionTitle,
      workout: workoutData,
    };

    try {
      await addWorkout(formData);
      setDate("");
      setSessionTitle("");
      setExerciseCount(0);
      setSelectedExercises([]); // 選択されたエクササイズを初期化
      await fetchWorkoutHistory();
      console.log(formData);
      alert("ワークアウトを追加しました。お疲れ様でした!!");
    } catch (error) {
      alert("エラーが発生しました。もう一度試してください。");
      console.error(error);
    }
  };

  return {
    date,
    setDate,
    sessionTitle,
    setSessionTitle,
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
  };
};
