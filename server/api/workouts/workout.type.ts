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

// add-remove用
export type Set = {
  setId?: number;
  setNumber: number;
  weight: number;
  reps: number;
  status?: string;
};

export type Exercise = {
  exerciseId: number;
  // exerciseName: string;
  sets: Set[];
};

export type AddWorkoutRequestBody = {
  date: string;
  sessionTitle: string;
  workout: Exercise[];
  userId: number;
};

export type EditWorkoutRequestBody = {
  sessionId: number;
  date: string;
  sessionTitle: string;
  workouts: Exercise[];
  // userId: number;
};
