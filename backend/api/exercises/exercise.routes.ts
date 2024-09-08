import express, { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import authMiddleware from "../middleware/auth";
import * as logic from "./exercise.logic";
import { createSuccessResponse } from "../common/utils/response";
import { errorHandler } from "../middleware/error/errorHandler";

export const exercisesRouter = express.Router();

// エクササイズ一覧取得api
exercisesRouter.post(
  "/get-all-exercises",
  authMiddleware, // 認証ミドルウェアを適用
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // エクササイズ一覧取得
      const exerciseData = await logic.getExercises();

      // 返却用データ生成
      const responseData = createSuccessResponse(
        "エクササイズ一覧の取得に成功しました。",
        exerciseData
      );
      return res.status(StatusCodes.OK).json(responseData);
    } catch (error: unknown) {
      if (error instanceof Error) {
        next(errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
      } else {
        next(
          errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, "原因不明のエラー")
        );
      }
    }
  }
);
