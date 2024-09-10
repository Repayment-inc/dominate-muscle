// history用
type SetHistory = {
  setId: number;
  setNumber: number;
  weight: number;
  reps: number;
};

// type ExerciseHistory = {
//   exerciseId: number;
//   exerciseName: string;
//   partId: number;
//   partName: string;
//   exerciseOrder: number;
//   sets: SetHistory[];
// };

// type Workout = {
//   exercises: ExerciseHistory[];
// };

type Workout = {
  exerciseId: number;
  exerciseName: string;
  partId: number;
  partName: string;
  exerciseOrder: number;
  sets: SetHistory[];
};

type WorkoutHistory = {
  sessionId: number;
  sessionTitle: string;
  date: string;
  workouts: Workout[];
};

export type HistoryData = {
  workoutHistory: WorkoutHistory[];
};



type BaseSet = {
  setNumber: number;
  weight: number;
  reps: number;
}

export type BaseExercise = {
  exerciseId: number;
  // exerciseName: string;
  // sets: Set[];
};

// ワークアウト追加 start
type AddSet = BaseSet;
type AddExercise = BaseExercise & {
  sets: AddSet[];
};
/**
 * ワークアウト追加
 */
type AddWorkoutType = {
  userId: number;
  date: string;
  sessionTitle: string;
  workouts: AddExercise[];
};
// ワークアウト追加 end

// ワークアウト編集 start
export type EditSet = BaseSet & {
  setId: number;
  status: string;
};
export type EditExercise = BaseExercise & {
  sets: EditSet[];
};
/**
 * ワークアウト編集
 */
type EditWorkoutType = {
  sessionId: number;
  date: string;
  sessionTitle: string;
  workouts: EditExercise[];
  // userId: number;
};
// ワークアウト編集 end



export { AddWorkoutType, EditWorkoutType}