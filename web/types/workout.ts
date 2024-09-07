export type Set = {
    setId: number;
    setNumber: number;
    weight: string;
    reps: number;
  };
  
  type Workout = {
    exerciseId: number;
    exerciseName: string;
    partId: number;
    partName: string;
    exerciseOrder: number;
    sets: Set[];
  };
  
  export type Workouts = {
    sessionId: number;
    sessionTitle: string;
    date: string;
    workouts: Workout[];
  };
  