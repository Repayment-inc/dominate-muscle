// // src/components/WeeklyChart.tsx

// import React from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// const WeeklyChart: React.FC<{ data: any[] }> = ({ data }) => {
//   return (
//     <ResponsiveContainer width="100%" height={400}>
//       <LineChart
//         data={data}
//         margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//       >
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="date" />
//         <YAxis />
//         <Tooltip />
//         <Legend />
//         <Line type="monotone" dataKey="reps" stroke="#82ca9d" />
//       </LineChart>
//     </ResponsiveContainer>
//   );
// };

// export default WeeklyChart;
