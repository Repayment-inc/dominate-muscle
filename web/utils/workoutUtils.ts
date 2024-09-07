import { WorkoutHistoryEntry } from "@/types/history";

export const groupByMonth = (workoutHistory: WorkoutHistoryEntry[]) => {
  return workoutHistory.reduce<{ [key: string]: WorkoutHistoryEntry[] }>(
    (acc, workout) => {
      const month = workout.date.slice(0, 7); // YYYY-MM形式
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(workout);
      return acc;
    },
    {},
  );
};

export const sortWorkouts = (
  workouts: WorkoutHistoryEntry[],
  order: "asc" | "desc",
) => {
  return workouts.slice().sort((a, b) => {
    if (order === "desc") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
};
