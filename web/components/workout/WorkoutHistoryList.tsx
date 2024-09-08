// src/components/WorkoutHistoryList.tsx

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WorkoutHistoryEntry } from "@/types/history";

interface GroupedWorkouts {
  [key: string]: WorkoutHistoryEntry[];
}

interface WorkoutHistoryListProps {
  groupedWorkouts: GroupedWorkouts;
  onWorkoutSelect: (workout: WorkoutHistoryEntry) => void;
}

export const WorkoutHistoryList: React.FC<WorkoutHistoryListProps> = ({
  groupedWorkouts,
  onWorkoutSelect,
}) => {
  return (
    <>
      {Object.keys(groupedWorkouts).map((month, monthIndex) => (
        <div key={monthIndex} className="mb-4">
          <h2 className="text-center mb-2">{month}</h2>
          {groupedWorkouts[month].map((entry, index) => (
            <div key={index} className="flex justify-center p-1">
              <Card
                onClick={() => onWorkoutSelect(entry)}
                className="w-[350px] cursor-pointer"
              >
                <CardHeader>
                  <CardTitle>{entry.date}</CardTitle>
                  <CardDescription>
                    <div className="font-bold">{entry.sessionTitle}</div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {entry.workouts.map((workout, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <p className="text-gray-500 text-sm">
                        {workout.exerciseName}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {workout.sets.length}セット
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      ))}
    </>
  );
};