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
import { validateRequest } from "../middleware/validateRequest";
import { AddWorkoutType, EditWorkoutType } from "./workout.type";
import { AddWorkoutReqSchema, EditWorkoutReqSchema } from "./workout.schema";

export const workoutsRouter = express.Router();

// workoutの登録
workoutsRouter.post(
  "/add",
  authMiddleware, // 認証ミドルウェアを適用
  validateRequest(AddWorkoutReqSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { date, sessionTitle, workouts } = req.body;
      const userId = req.user?.id;

      // ワークアウトをDBに追加
      await logic.addWorkout({ date, sessionTitle, workouts, userId });

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

// workoutの削除
workoutsRouter.post(
  "/delete",
  authMiddleware, // 認証ミドルウェアを適用
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { date } = req.body;
      const userId = req.user?.id;

      // バリデーションチェック

      // ワークアウトをDBに削除
      await logic.deleteWorkout(date, userId);

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

// workoutの編集
// workoutの編集
workoutsRouter.post(
  "/edit",
  authMiddleware,
  validateRequest(EditWorkoutReqSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        sessionId,
        date,
        sessionTitle,
        workouts,
      }: EditWorkoutType = req.body;

      // ワークアウトをDBに更新
      await logic.updateWorkout({ sessionId, date, sessionTitle, workouts });

      // 返却用データ生成
      const responseData = createSuccessResponse(
        "ワークアウトの編集に成功しました。",
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
