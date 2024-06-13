type Set = {
  set_number: number;
  weight: number;
  reps: number;
};

type Exercise = {
  exerciseId: number;
  exerciseName: string;
  partId: number;
  partName: string;
  sets: Set[];
};

type Workout = {
  title: string;
  exercises: Exercise[];
};

type WorkoutHistory = {
  // user_id: number;
  // username: string;
  date: string;
  workouts: Workout[];
};

export type HistoryData = {
  workoutHistory: WorkoutHistory[];
};
