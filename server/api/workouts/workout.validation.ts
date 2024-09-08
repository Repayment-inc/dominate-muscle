import { Exercise, Set } from "./workout.type";

export const validateDate = (date: string): string | null => {
  if (!date) {
    return "日付を入力してください";
  }
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return "日付の形式が正しくありません (YYYY-MM-DD)";
  }
  return null;
};

export const validateSessionTitle = (sessionTitle: string): string | null => {
  if (!sessionTitle) {
    return "セッションタイトルを入力してください";
  }
  if (sessionTitle.length === 0) {
    return "セッションタイトルを入力してください";
  }
  return null;
};

export const validateWorkout = (workout: Exercise[]): string | null => {
  if (!Array.isArray(workout)) {
    return "ワークアウトは配列である必要があります";
  }

  for (const exercise of workout) {
    if (!exercise.exerciseId || typeof exercise.exerciseId !== "number") {
      return "有効なエクササイズIDを入力してください";
    }
    // if (!exercise.exerciseName || typeof exercise.exerciseName !== "string") {
    //   return "エクササイズ名を入力してください";
    // }
    if (!Array.isArray(exercise.sets)) {
      return "セットは配列である必要があります";
    }
    for (const set of exercise.sets) {
      const setValidationError = validateSet(set);
      if (setValidationError) {
        return setValidationError;
      }
    }
  }

  return null;
};

export const validateSet = (set: Set): string | null => {
  if (set.setNumber == null || typeof set.setNumber !== "number") {
    return "セット番号は整数である必要があります";
  }
  if (set.weight == null || typeof set.weight !== "number" || set.weight < 0) {
    return "重量は0以上の数値である必要があります";
  }
  if (set.reps == null || typeof set.reps !== "number" || set.reps <= 0) {
    return "レップ数は0より大きい整数である必要があります";
  }
  return null;
};
