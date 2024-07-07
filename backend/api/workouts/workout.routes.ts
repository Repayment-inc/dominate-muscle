/** これがないと[req.user?.id]でTypeエラーが頻繁にあったため残す。　今はtsconfigいじってなんとか解決済み
/// <reference path="../types/express/index.d.ts" />
　**/

import express, { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
// import { logInfo, logError } from "../common/utils/logger";
import authMiddleware from "../middleware/auth";
import * as logic from "./workout.logic";
import { createSuccessResponse } from "../common/utils/response";
import { errorHandler } from "../middleware/error/errorHandler";

export const workoutsRouter = express.Router();

// workoutの登録
workoutsRouter.post(
  "/add",
  authMiddleware, // 認証ミドルウェアを適用
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { date, sessionTitle, workout } = req.body;

      // ワークアウトをDBに追加
      await logic.addWorkout(date, sessionTitle, workout, req.user?.id);

      // 返却用データ生成
      const responseData = createSuccessResponse(
        "ワークアウトの登録に成功しました。",
        {}
      );

      return res.status(StatusCodes.CREATED).json(responseData);
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

// workoutの登録
workoutsRouter.post(
  "/delete",
  authMiddleware, // 認証ミドルウェアを適用
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { date } = req.body;

      // バリデーションチェック
      if (!date) return next(errorHandler(400, "日付を入力してください"));

      // ワークアウトをDBに追加
      await logic.deleteWorkout(date, req.user?.id);

      // 返却用データ生成
      const responseData = createSuccessResponse(
        "ワークアウトの削除に成功しました。",
        {}
      );

      return res.status(StatusCodes.CREATED).json(responseData);
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

// ワークアウト履歴取得api
workoutsRouter.post(
  "/history",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // ワークアウト履歴取得
      const historyData = await logic.getWorkoutHistory(req.user?.id);

      // 返却用データ生成
      const responseData = createSuccessResponse(
        "ワークアウト履歴の取得に成功しました",
        historyData
      );

      res.status(StatusCodes.OK).json(responseData);
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
