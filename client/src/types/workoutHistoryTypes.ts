export type Set = {
  setId?: number;
  setNumber: number;
  weight: string;
  reps: number;
  status?: "updated" | "unchanged" | "deleted" | "new";
};

// 一旦optionalにしてる。　改修予定
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
