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
import {
  // userValidation,
  validateEmail,
  validatePassword,
} from "./user.validation";
import { errorHandler } from "../middleware/error/errorHandler";
import authMiddleware from "../middleware/auth";

export const userRouter = express.Router();

// ユーザーを登録する
userRouter.post(
  "/dregister",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, email, password } = req.body;

      if (!username)
        return next(errorHandler(400, "ユーザー名を入力してください"));

      // メール入力チェック
      const emailError = validateEmail(email);
      if (emailError) return next(errorHandler(400, emailError));

      // パスワード入力チェック
      const passwordError = validatePassword(password);
      if (passwordError) return next(errorHandler(400, passwordError));

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
userRouter.post("/dlogin", async (req: Request, res: Response, next) => {
  try {
    const { email, password } = req.body;

    // 入力チェック
    const requiredFields = ["email", "password"]; // 必須フィールドを配列で定義
    const missingFields = requiredFields.filter((field) => !req.body[field]); // 未入力項目を配列で定義

    if (missingFields.length > 0) {
      const missingFieldsMessage =
        missingFields.join("、") + "を入力してください";
      return next(errorHandler(StatusCodes.BAD_REQUEST, missingFieldsMessage));
    }

    const checkResult = await logic.checkEmailExists(email);
    if (!checkResult) {
      // logInfo(`No user found for email: ${email}`, 90);
      return next(
        errorHandler(
          StatusCodes.NOT_FOUND,
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