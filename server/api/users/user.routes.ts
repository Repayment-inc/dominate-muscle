import express, { Request, Response, NextFunction } from "express";
import { TokenData } from "./user.type";
import { StatusCodes } from "http-status-codes";
import * as logic from "./user.logic";
import { pool } from "../db/database";
import jwt, { JwtPayload } from "jsonwebtoken";
import {
  createSuccessResponse,
  ApplicationError,
  SystemError,
} from "../common/utils/response";
import { logInfo, logError } from "../common/utils/logger";
import { errorHandler } from "../middleware/error/errorHandler";
import authMiddleware from "../middleware/auth";
import { validateRequest } from "../middleware/validateRequest";
import { UserSchema, LoginSchema } from "./user.schema";

export const userRouter = express.Router();


// ユーザーを登録する
userRouter.post(
  "/dregister",
  validateRequest(UserSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, email, password } = req.body;

      // 既存ユーザチェック;
      const checkResult = await logic.checkEmailExists(email);
      if (checkResult)
        return next(
          errorHandler(
            StatusCodes.BAD_REQUEST,
            `${email} は既に登録されています`
          )
        );

      // ユーザの登録;
      const registedUserId = await logic.create(req.body);

      // トークン生成
      await logic.generateTokens(registedUserId);

      // レスポンス生成
      const responseData = createSuccessResponse(
        "User registered successfully",
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

// ログイン
userRouter.post("/dlogin", validateRequest(LoginSchema), async (req: Request, res: Response, next) => {
  try {
    const { email, password } = req.body;

    // ユーザ確認;
    const checkResult = await logic.checkEmailExists(email);
    if (!checkResult) {
      // logInfo(`No user found for email: ${email}`, 90);
      return next(
        errorHandler(
          StatusCodes.BAD_REQUEST,
          "ユーザが見つかりませんでした。正しいメールアドレスかどうか確認してください"
        )
      );
    }

    const comparePassword = await logic.comparePassword(email, password);
    if (!comparePassword) {
      // logInfo("Incorrect password attempt.", 90);
      return next(
        errorHandler(
          StatusCodes.BAD_REQUEST,
          "パスワードが間違っています。ご確認の上でもう一度ご入力下さい"
        )
      );
    }

    // トークン生成
    const tokens: TokenData = await logic.generateTokens(checkResult.id);
    const tokendata = {
      username: checkResult.username,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      type: "Bearer",
    };

    const responseData = createSuccessResponse(
      "ログインに成功しました",
      tokendata
    );

    return res.status(StatusCodes.OK).json(responseData);
  } catch (error: unknown) {
    if (error instanceof Error) {
      next(errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
    } else {
      next(errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, "原因不明のエラー"));
    }
  }
});

userRouter.post("/refreshToken", async (req: Request, res: Response, next) => {
  const { token } = req.body;

  // トークンが提供されているか確認
  if (!token) {
    return res.status(401).json({ error: "Refresh token is required" });
  }

  try {
    // トークンのリフレッシュ処理をlogicに移動
    const tokendata = await logic.refreshToken(token);

    // 成功レスポンスを返す
    const responseData = createSuccessResponse(
      "リフレッシュトークンの更新に成功しました。",
      tokendata
    );

    res.json(responseData);
  } catch (error: unknown) {
    if (error instanceof Error) {
      next(errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
    } else {
      next(errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, "原因不明のエラー"));
    }
  }
});


// ユーザープロファイルを取得する
userRouter.post("/profile", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id; // verifyToken ミドルウェアによって追加されたユーザーID

    const userProfile = await logic.getUserProfile(userId);

    if (!userProfile) {
      return next(errorHandler(StatusCodes.NOT_FOUND, "ユーザーが見つかりませんでした"));
    }

    const responseData = createSuccessResponse(
      "ユーザープロファイルの取得に成功しました",
      userProfile
    );

    return res.status(StatusCodes.OK).json(responseData);
  } catch (error: unknown) {
    if (error instanceof Error) {
      next(errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
    } else {
      next(errorHandler(StatusCodes.INTERNAL_SERVER_ERROR, "原因不明のエラー"));
    }
  }
});