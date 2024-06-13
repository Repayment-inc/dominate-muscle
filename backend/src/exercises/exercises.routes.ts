import express, { Request, Response } from "express";
// import { UnitUser, User, JwtToken } from "./users.interface";
import { StatusCodes } from "http-status-codes";
// import * as database from "./users.database";
import { pool } from "../db/database";
import jwt from "jsonwebtoken";
import * as dotevnv from "dotenv";
import { ApiResponse } from "../common/utils/response";
import { logInfo, logError } from "../common/utils/logger";
import authMiddleware from "../middleware/auth";

export const exercisesRouter = express.Router();

type Exercises = {
  exerciseId: number;
  exerciseName: string;
  bodyPartId: number;
  bodyPartName: string;
};

type ExerciseData = {
  exercises: Exercises[];
};

// エクササイズ一覧取得api
exercisesRouter.post(
  "/get-all-exercises",
  authMiddleware, // 認証ミドルウェアを適用
  async (req: Request, res: Response) => {
    try {
      // ユーザーIDをログに出力
      console.log("User ID:", req.user?.id);

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

      const responseData: ApiResponse<ExerciseData> = {
        resultCode: 0,
        message: "",
        resultData: exerciseData,
      };

      // res.json({ responseData });
      res.json(responseData);
    } catch (error) {
      console.error(error);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
    }
  }
);
