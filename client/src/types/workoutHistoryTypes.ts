export type Set = {
  setId?: number;
  setNumber: number;
  weight: string;
  reps: number;
  status?: "updated" | "unchanged" | "deleted" | "new";
};

type Workout = {
  exerciseId: number;
  exerciseName?: string;
  partId?: number;
  partName?: string;
  exerciseOrder?: number;
  sets: Set[];
};

export type WorkoutHistoryEntry = {
  sessionId: number;
  sessionTitle: string;
  date: string;
  workouts: Workout[];
};
