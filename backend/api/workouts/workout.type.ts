// history用
type SetHistory = {
  setNumber: number;
  weight: number;
  reps: number;
};

type ExerciseHistory = {
  exerciseId: number;
  exerciseName: string;
  partId: number;
  partName: string;
  sets: SetHistory[];
};

type Workout = {
  title: string;
  exercises: ExerciseHistory[];
};

type WorkoutHistory = {
  date: string;
  workouts: Workout[];
};

export type HistoryData = {
  workoutHistory: WorkoutHistory[];
};

// add-remove用
type Set = {
  setNumber: number;
  weight: number;
  reps: number;
};

export type Exercise = {
  exerciseId: number;
  exerciseName: string;
  sets: Set[];
};
