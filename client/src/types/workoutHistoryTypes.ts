export type Set = {
  set_number: number;
  weight: string;
  reps: number;
};

export type Exercise = {
  exerciseId: number;
  exerciseName: string;
  partId: number;
  partName: string;
  sets: Set[];
};

export type Workout = {
  title: string;
  exercises: Exercise[];
};

export type WorkoutHistoryEntry = {
  date: string;
  workouts: Workout[];
};
