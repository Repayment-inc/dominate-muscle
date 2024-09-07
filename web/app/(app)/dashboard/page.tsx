'use client'
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Workouts } from "@/types/workout";
// import { BarChart, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useExercises } from "@/hooks/useExercises";
import { useWorkout } from "@/hooks/useWorkout";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import BodyPartChart from "@/components/charts/BodyPartChart";
import ExerciseChart from "@/components/charts/ExerciseChart";
// import WeeklyChart from "@/components/dashboard/WeeklyChart";
import ExerciseLineChart from "@/components/charts/ExerciseLineChart";
// import { generateWeeklyDates } from "@/utils/utils";
import {
  weeklyCount,
  flattenWorkoutHistory,
  filterByExerciseId,
  filterByFirstSet,
  sortData,
} from "../../../lib/dashboard";
import { ExerciseDialog } from "@/components/workout/ExerciseDialog";

// import { Footer } from "@/components/notifications/organisms/Footer";

interface ExerciseCount {
  exerciseId: number;
  exerciseName: string;
  exerciseCounts: number;
}

export default function DashboardPage() {

  // 履歴データの取得
  const [workoutHistory, setWorkoutHistory] = useState<Workouts[]>(
    [],
  );

  useEffect(() => {
    // ローカルストレージからキャッシュされたデータを取得
    const cachedData = localStorage.getItem("workoutHistory");
    console.log("cachedData", cachedData);
    if (cachedData) {
      // 取得したデータをオブジェクト形式でパースし、workoutHistoryに設定
      const parsedData = JSON.parse(cachedData).workoutHistory;
      setWorkoutHistory(parsedData);
      console.log("parsedData", parsedData);
    }
  }, []);

  const { exercises } = useExercises();
  const { isDialogOpen, setDialogOpen } = useWorkout();

  const [selectedExerciseId, setSelectedExerciseId] = useState<number>(0);

  const handleRowClick = (exerciseId: number) => {
    setSelectedExerciseId(exerciseId);
    setDialogOpen(false);
  };

  // --------------------後で使う--------------------
  // 週初めの日付を取得
  // const weeklyDates = generateWeeklyDates();
  // 週ごとのトータルrep,set数を取得
  // const weeklyTotalScoreData = calculateWeeklyTotalScore(workoutHistory);
  // ----------------------------------------

  // -------------------週間ワークアウト画面用---------------------
  const weeklyCountData = weeklyCount(workoutHistory);
  // ----------------------------------------

  // --------------------グラフ用のフラットデータ悪性--------------------
  const flatData = flattenWorkoutHistory(workoutHistory);
  console.log(flatData);
  // ----------------------------------------

  // -------------------部位別TOP5---------------------
  const partCountData = flatData.reduce(
    (
      acc: Record<
        number,
        { partId: number; partName: string; partCounts: number }
      >,
      item,
    ) => {
      const key = item.partId;
      if (!acc[key]) {
        acc[key] = {
          partId: item.partId,
          partName: item.partName,
          partCounts: 0,
        };
      }
      acc[key].partCounts += 1;
      return acc;
    },
    {},
  );

  // オブジェクトを配列に変換
  const partCountArray = Object.values(partCountData);
  // partCountsが多い順にソート
  const bodyPartsCounts = partCountArray.sort(
    (a, b) => b.partCounts - a.partCounts,
  );
  console.log(bodyPartsCounts);
  // ----------------------------------------

  // -------------------エクササイズ別別TOP5---------------------
  // 各エクササイズのカウントを集計
  const exerciseCountData = flatData.reduce(
    (acc: Record<number, ExerciseCount>, item) => {
      const key = item.exerciseId;
      if (!acc[key]) {
        acc[key] = {
          exerciseId: item.exerciseId,
          exerciseName: item.exerciseName,
          exerciseCounts: 0,
        };
      }
      acc[key].exerciseCounts += 1;
      return acc;
    },
    {},
  );

  // オブジェクトを配列に変換
  const exerciseCountArray: ExerciseCount[] = Object.values(exerciseCountData);
  // exerciseCountsが多い順にソートし、トップ5だけを保持
  const topFiveExercises = exerciseCountArray
    .sort(
      (a: ExerciseCount, b: ExerciseCount) =>
        b.exerciseCounts - a.exerciseCounts,
    )
    .slice(0, 5);
  console.log(topFiveExercises);
  // ----------------------------------------

  // console.log(flatData);
  const targetExerciseData = filterByExerciseId(flatData, selectedExerciseId);
  // console.log(targetExerciseData);
  const firstSetData = filterByFirstSet(targetExerciseData);
  const sortedData = sortData(firstSetData);
  console.log(sortedData);

  return (
    <article>
      <h1 className="text-2xl font-semibold leading-none tracking-tight my-4">
        週間ワークアウト
      </h1>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={weeklyCountData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Legend />
          {/* <Line type="monotone" dataKey="sets" stroke="#8884d8" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="weight" stroke="#82ca9d" /> */}
          <Bar type="monotone" dataKey="counts" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>

      <h1 className="text-2xl font-semibold leading-none tracking-tight my-4">
        月間、週間、エクササイズ別
      </h1>
      <Tabs defaultValue="BodyPartChart" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="BodyPartChart">部位別チャート</TabsTrigger>
          <TabsTrigger value="ExerciseChart">
            エクササイズ別チャート
          </TabsTrigger>
          <TabsTrigger value="ExerciseLineChart">
            特定のエクササイズ
          </TabsTrigger>
          <TabsTrigger value="WeeklyChart">週間チャート</TabsTrigger>
        </TabsList>
        <TabsContent value="BodyPartChart">
          <h2 className="">部位別チャート</h2>
          <BodyPartChart data={bodyPartsCounts} />
        </TabsContent>
        <TabsContent value="ExerciseChart">
          <h2>エクササイズ別チャート</h2>
          <ExerciseChart data={topFiveExercises} />
        </TabsContent>
        <TabsContent value="ExerciseLineChart">
          <h2 className="">特定のエクササイズ</h2>
          <div className="flex justify-start gap-10 my-3 ml-3">
            {/* <Button onClick={addExercise}>次の種目へ</Button> */}
            <Button onClick={() => setDialogOpen(true)}>エクササイズを選択</Button>
            <ExerciseDialog
              isOpen={isDialogOpen}
              onOpenChange={setDialogOpen}
              exercises={exercises}
              onExerciseSelect={handleRowClick}
            />
            {/* <Button onClick={removeExercise}>種目を削除</Button> */}
          </div>
          <ExerciseLineChart data={sortedData} />
        </TabsContent>

        <TabsContent value="WeeklyChart">
          <h2>開発中</h2>
          {/* <WeeklyChart data={weeklyData} /> */}
        </TabsContent>
      </Tabs>

      {/* <Footer /> */}
    </article>
  );
};


