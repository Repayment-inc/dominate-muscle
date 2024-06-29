import { pool } from "../db/database";
import { ExerciseData } from "./exercise.interface";

export const getExercises = async (): Promise<ExerciseData> => {
  const result = await pool.query(`
    SELECT 
      ex.id,
      ex.name,
      ex.body_part_id,
      bp.part AS body_part_name
    FROM 
      exercises ex
    JOIN 
      body_parts bp ON ex.body_part_id = bp.id;
  `);

  const rawData = result.rows;

  const exerciseData: ExerciseData = { exercises: [] };
  for (const item of rawData) {
    exerciseData.exercises.push({
      exerciseId: item.id,
      exerciseName: item.name,
      bodyPartId: item.body_part_id,
      bodyPartName: item.body_part_name,
    });
  }

  return exerciseData;
};
