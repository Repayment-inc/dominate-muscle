// src/components/ExerciseChart.tsx

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ExerciseData {
  date: string;
  weight: number;
  reps: number;
}

const ExerciseChart: React.FC<{ data: ExerciseData[] }> = ({ data }) => {
  return (
    <ResponsiveContainer
      width="100%"
      height={400}
      // height="100%"
    >
      <LineChart
        // width={500}
        // height={300}
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis dataKey="weight" domain={[20, "auto"]} />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="weight"
          stroke="#ff7300"
          activeDot={{ r: 8 }}
        />
        {/* <Line
          type="monotone"
          dataKey="reps"
          stroke="#8884d8"
        /> */}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ExerciseChart;
