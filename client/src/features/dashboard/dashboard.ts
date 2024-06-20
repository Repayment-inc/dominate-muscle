import { groupByWeek } from "@/utils/utils";
import { WorkoutHistoryEntry } from "@/types/workoutHistoryTypes";

// workout履歴を週ごとにグループ化し、週ごとのワークアウト数をカウントする
export function weeklyCount(workoutHistory: WorkoutHistoryEntry[]) {
  return Object.entries(groupByWeek(workoutHistory))
    .sort(([week1], [week2]) => week1.localeCompare(week2)) // 日付の昇順にソート
    .map(([week, workouts]) => ({
      week, // 週の開始日
      counts: workouts.length, // その週のワークアウト数
    }));
}

// 週ごとのトータルrep,set数を計算
export function calculateWeeklyTotalScore(
  workoutHistory: WorkoutHistoryEntry[],
) {
  return Object.entries(groupByWeek(workoutHistory))
    .sort(([week1], [week2]) => week1.localeCompare(week2)) // 日付の昇順にソート
    .map(([week, workouts]) => ({
      week,
      sets: workouts.reduce(
        (total, current) =>
          total +
          current.workouts.reduce(
            (sum, workout) =>
              sum +
              workout.exercises.reduce(
                (setSum, exercise) => setSum + exercise.sets.length,
                0,
              ),
            0,
          ),
        0,
      ),
      reps: workouts.reduce(
        (total, current) =>
          total +
          current.workouts.reduce(
            (sum, workout) =>
              sum +
              workout.exercises.reduce(
                (repSum, exercise) =>
                  repSum + exercise.sets.reduce((r, set) => r + set.reps, 0),
                0,
              ),
            0,
          ),
        0,
      ),
    }));
}

// ------------------------------logicに移動する--------------------------------------------
type FlattenedData = {
  date: string;
  title: string;
  exerciseId: number;
  exerciseName: string;
  partId: number;
  partName: string;
  set_number: number;
  weight: number;
  reps: number;
};

// データを変換する関数
export const flattenWorkoutHistory = (
  data: WorkoutHistoryEntry[],
): FlattenedData[] => {
  return data.flatMap((entry) =>
    entry.workouts.flatMap((workout) =>
      workout.exercises.flatMap((exercise) =>
        exercise.sets.map((set) => ({
          date: entry.date,
          title: workout.title,
          exerciseId: exercise.exerciseId,
          exerciseName: exercise.exerciseName,
          partId: exercise.partId,
          partName: exercise.partName,
          set_number: set.set_number,
          weight: parseFloat(set.weight),
          reps: set.reps,
        })),
      ),
    ),
  );
};

// console.log(
//   "flat = " + JSON.stringify(flattenWorkoutHistory(workoutHistory)),
// );

export const filterByExerciseId = (
  data: FlattenedData[],
  exerciseId: number,
): FlattenedData[] => {
  return data.filter((entry) => entry.exerciseId === exerciseId);
};

// 一番最初のセットにフィルター
export const filterByFirstSet = (data: FlattenedData[]): FlattenedData[] => {
  return data.filter((entry) => entry.set_number === 1);
};

export const sortData = (data: FlattenedData[]): FlattenedData[] => {
  return data.sort((a, b) => a.date.localeCompare(b.date));
};

// 1RM= 重量×回数÷40＋重量

// --------------------------------------------------------------------------
