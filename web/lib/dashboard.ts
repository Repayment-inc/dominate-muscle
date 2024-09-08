import { groupByWeek } from "@/utils/utils";
import { Workouts } from "@/types/workout";

// workout履歴を週ごとにグループ化し、週ごとのワークアウト数をカウントする
export function weeklyCount(workoutHistory: Workouts[]) {
  return Object.entries(groupByWeek(workoutHistory))
    .sort(([week1], [week2]) => week1.localeCompare(week2)) // 日付の昇順にソート
    .map(([week, workouts]) => ({
      week, // 週の開始日
      counts: workouts.length, // その週のワークアウト数
    }));
}

// 週ごとのトータルrep,set数を計算
export function calculateWeeklyTotalScore(
  workoutHistory: Workouts[],
) {
  return Object.entries(groupByWeek(workoutHistory))
    .sort(([week1], [week2]) => week1.localeCompare(week2)) // 日付の昇順にソート
    .map(([week, workouts]) => ({
      week,
      sets: workouts.reduce(
        (total, current) =>
          total +
          current.workouts.reduce(
            (sum, workout) => sum + workout.sets.length,
            0,
          ),
        0,
      ),
      reps: workouts.reduce(
        (total, current) =>
          total +
          current.workouts.reduce(
            (sum, workout) =>
              sum + workout.sets.reduce((r, set) => r + set.reps, 0),
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
  data: Workouts[],
): FlattenedData[] => {
  return data.flatMap((entry) =>
    entry.workouts.flatMap((workout) =>
      workout.sets.map((set) => ({
        date: entry.date,
        title: entry.sessionTitle,
        exerciseId: workout.exerciseId,
        exerciseName: workout.exerciseName,
        partId: workout.partId,
        partName: workout.partName,
        set_number: set.setNumber,
        weight: parseFloat(set.weight),
        reps: set.reps,
      })),
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
