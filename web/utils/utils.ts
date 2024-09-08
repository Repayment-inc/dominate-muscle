import moment from "moment";
import { WorkoutHistoryEntry } from "@/types/history";

// 過去7週間の週初めの日付を生成する関数
export const generateWeeklyDates = () => {
  const weeks = [];
  // 過去1週間前から現在までの週初めの日付を配列に追加
  for (let i = -1; i < 6; i++) {
    const startOfWeek = moment()
      .subtract(i, "weeks")
      .startOf("isoWeek")
      .format("YYYY-MM-DD");
    weeks.push(startOfWeek);
  }
  // 生成された日付を逆順にして返す
  return weeks.reverse();
};

// 週ごとにデータをグループ化する関数
export const groupByWeek = (workoutHistory: WorkoutHistoryEntry[]) => {
  return workoutHistory.reduce<{ [key: string]: WorkoutHistoryEntry[] }>(
    (acc, workout) => {
      const weekStart = moment(workout.date).startOf("isoWeek").format("MM-DD");
      if (!acc[weekStart]) {
        acc[weekStart] = [];
      }
      acc[weekStart].push(workout);
      return acc;
    },
    {},
  );
};
