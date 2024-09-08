export type Exercises = {
  exerciseId: number;
  exerciseName: string;
  bodyPartId: number;
  bodyPartName: string;
};

export type ExerciseData = {
  exercises: Exercises[];
};
