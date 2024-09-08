export type Set = {
  setId?: number;
  setNumber: number;
  weight: string;
  reps: number;
  status?: "updated" | "unchanged" | "deleted" | "new";
};

// ワークアウト編集段階でexerciseName, partId, partName, exerciseOrderがundefinedの場合がある。
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
