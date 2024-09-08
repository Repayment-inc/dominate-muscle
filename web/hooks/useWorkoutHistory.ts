import { useState, useEffect, useMemo } from "react";
import { WorkoutHistoryEntry } from "@/types/history";
// import { fetchWorkoutHistory } from "@/hooks/useAPI";
import { groupByMonth, sortWorkouts } from "@/utils/workoutUtils";

export const useWorkoutHistory = () => {
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutHistoryEntry[]>(
    [],
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // 履歴データの取得
  useEffect(() => {
    // ローカルストレージからキャッシュされたデータを取得
    const cachedData = localStorage.getItem("workoutHistory");
    if (cachedData) {
      // 取得したデータをオブジェクト形式でパースし、workoutHistoryに設定
      const parsedData = JSON.parse(cachedData).workoutHistory;
      setWorkoutHistory(parsedData);
    }
  }, []);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "desc" ? "asc" : "desc");
  };

  const groupedWorkouts = useMemo(
    () => groupByMonth(sortWorkouts(workoutHistory, sortOrder)),
    [workoutHistory, sortOrder],
  );

  return {
    workoutHistory,
    setWorkoutHistory,
    sortOrder,
    toggleSortOrder,
    groupedWorkouts,
  };
};
