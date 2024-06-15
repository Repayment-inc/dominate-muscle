/** これがないと[req.user?.id]でTypeエラーが頻繁にあったため残す。　今はtsconfigいじってなんとか解決済み
/// <reference path="../types/express/index.d.ts" />
　**/

import express, { Request, Response } from "express";
// import { UnitUser, User, JwtToken } from "./users.interface";
import { StatusCodes } from "http-status-codes";
// import * as database from "./users.database";
import { pool } from "../db/database";
import jwt from "jsonwebtoken";
import * as dotevnv from "dotenv";
import { ApiResponse } from "../common/utils/response";
import { logInfo, logError } from "../common/utils/logger";
import { HistoryData } from "./workouts.interface";
import authMiddleware from "../middleware/auth";

export const workoutsRouter = express.Router();

// workoutの登録
workoutsRouter.post(
  "/add",
  authMiddleware, // 認証ミドルウェアを適用
  async (req: Request, res: Response) => {
    const client = await pool.connect();
    try {
      const { date, workout } = req.body; // parts: [{ part: '胸', exercises: [{ name: 'ベンチプレス', sets: [{ set_number: 1, reps: 10 }, ...] }, ...] }]

      // トランザクションを開始
      await client.query("BEGIN");

      // ユーザーIDをログに出力
      console.log("User ID:", req.user?.id);
      const userId = req.user?.id;

      // セッションの登録とid取得
      const workoutSessionRes = await client.query(
        "INSERT INTO workout_sessions (user_id, date) VALUES ($1, $2) RETURNING id",
        [userId, date]
      );
      const sessionId = workoutSessionRes.rows[0].id;
      console.log("sessionId = " + sessionId);

      for (const exercise of workout) {
        for (const set of exercise.sets) {
          await client.query(
            "INSERT INTO workout_sets (session_id, exercise_id, set_number, weight, reps) VALUES ($1, $2, $3, $4, $5)",
            [
              sessionId,
              exercise.exerciseId,
              set.setNumber,
              set.weight,
              set.reps,
            ]
          );
        }
      }

      // 旧ソース 問題なければ削除
      // for (const part of parts) {
      //   const partIdRes = await client.query(
      //     "SELECT id FROM workout_parts WHERE part = $1",
      //     [part.part]
      //   );
      //   const partId = partIdRes.rows[0].id;

      //   for (const exercise of part.exercises) {
      //     const exerciseIdRes = await client.query(
      //       "SELECT id FROM exercises WHERE name = $1",
      //       [exercise.name]
      //     );
      //     const exerciseId = exerciseIdRes.rows[0].id;

      //     const userExerciseRes = await client.query(
      //       "SELECT id FROM user_exercises WHERE user_id = $1 AND part_id = $2 AND exercise_id = $3",
      //       [userId, partId, exerciseId]
      //     );
      //     const userExerciseId = userExerciseRes.rows[0].id;

      //     for (const set of exercise.sets) {
      //       await client.query(
      //         "INSERT INTO workout_sets (session_id, exercise_id, set_number, weight, reps) VALUES ($1, $2, $3, $4, $5)",
      //         [sessionId, userExerciseId, set.set_number, set.weight, set.reps]
      //       );
      //     }
      //   }
      // }

      await client.query("COMMIT");

      return res
        .status(StatusCodes.CREATED)
        .json({ message: "set created successfully" });
    } catch (error) {
      // エラーが発生した場合、トランザクションをロールバック
      await client.query("ROLLBACK");
      console.error("Error adding workout:", error);
      res.status(500).send("Error adding workout");
    } finally {
      client.release();
    }
  }
);

workoutsRouter.post(
  "/history",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const result = await pool.query(
        `
      SELECT 
        u.id as user_id,
        u.username,
        wsessions.date,
        bp.id as body_part_id,
        bp.part as body_part_name,
        ex.id as exercise_id,
        ex.name as exercise_name,
        wsets.set_number,
        wsets.weight,
        wsets.reps
      FROM 
        users u
        JOIN workout_sessions wsessions ON u.id = wsessions.user_id
        JOIN workout_sets wsets ON wsessions.id = wsets.session_id
        JOIN exercises ex ON ex.id = wsets.exercise_id
        JOIN body_parts bp ON bp.id = ex.body_part_id
      WHERE
        u.id = $1
      ORDER BY 
        wsessions.date DESC;
      `,
        [req.user?.id]
      );

      const rawData = result.rows;

      const historyData: HistoryData = { workoutHistory: [] };
      // const workoutHistory: WorkoutHistory[] = [];

      rawData.forEach((row) => {
        // 同じ日時のワークアウトを探す
        let workout = historyData.workoutHistory.find(
          (workout) =>
            new Date(workout.date).getTime() === new Date(row.date).getTime()
          // && workout.user_id === row.user_id
        );
        if (!workout) {
          // 同じ日時のワークアウトが見つからない場合、新しいワークアウトを作成
          workout = {
            // user_id: row.user_id,
            // username: row.username,
            date: new Date(row.date).toLocaleDateString("ja-JP", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }),
            workouts: [],
          };
          historyData.workoutHistory.push(workout);
        }

        // 同じ部位のワークアウトを探す
        let title = workout.workouts.find(
          (title) => title.title === row.body_part_name
        );
        // 同じ部位のワークアウトが見つからない場合、新しいワークアウトパートを作成
        if (!title) {
          title = { title: row.body_part_name, exercises: [] };
          workout.workouts.push(title);
        }

        // 同じエクササイズを探す
        let exercise = title.exercises.find(
          (exercise) => exercise.exerciseId === row.exercise_id
        );
        if (!exercise) {
          // 同じエクササイズが見つからない場合、新しいエクササイズを作成
          exercise = {
            exerciseId: row.exercise_id,
            exerciseName: row.exercise_name,
            partId: row.body_part_id,
            partName: row.body_part_name,
            sets: [],
          };
          title.exercises.push(exercise);
        }

        // エクササイズにセットを追加
        exercise.sets.push({
          set_number: row.set_number,
          weight: row.weight,
          reps: row.reps,
        });
      });

      const responseData: ApiResponse<HistoryData> = {
        resultCode: 0,
        message: "",
        resultData: historyData,
      };

      // res.json({ responseData });
      res.json(responseData);
    } catch (error) {
      console.error(error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
  }
);
