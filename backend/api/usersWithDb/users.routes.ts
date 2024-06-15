import express, { Request, Response } from "express";
import { UnitUser, User, JwtToken, TokenData } from "./users.interface";
import { StatusCodes } from "http-status-codes";
import * as database from "./users.database";
import * as logic from "./users.logic";
import { pool } from "../db/database";
import jwt, { JwtPayload } from "jsonwebtoken";
import * as dotevnv from "dotenv";
import {
  createSuccessResponse,
  ApplicationError,
  SystemError,
  ApiResponse,
} from "../common/utils/response";
import { logInfo, logError } from "../common/utils/logger";
// import { createSuccessResponse, createErrorResponse } from '../common/utils/response';
import { userValidation } from "./users.validation";

export const dUserRouter = express.Router();

// ユーザーを登録する
dUserRouter.post("/dregister", async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // validationチェック
    const validated = userValidation(username, email, password);
    if (validated) {
      const responseData = ApplicationError(validated.message, validated.error);
      return res.status(StatusCodes.BAD_REQUEST).json(responseData);
    }

    // 既存ユーザチェック;
    const checkResult = await logic.checkEmailExists(email);
    if (checkResult) {
      const responseData = ApplicationError(
        "ApplicationError",
        `${email} は既に登録されています`
      );
      return res.status(StatusCodes.BAD_REQUEST).json(responseData);
    }

    // ユーザの登録;
    const registedUserId = await logic.create(req.body);
    if (!registedUserId) {
      const responseData = ApplicationError(
        "System Error",
        `ユーザーの登録に失敗しました`
      );
      return res.status(StatusCodes.BAD_REQUEST).json(responseData);
    }

    // トークン生成
    const tokens: TokenData = await logic.generateTokens(registedUserId);

    // レスポンス生成
    const responseData = createSuccessResponse(
      "User registered successfully",
      {}
      // tokens
    );

    return res.status(StatusCodes.CREATED).json(responseData);
  } catch (err: unknown) {
    if (err instanceof Error) {
      const responseData = SystemError(
        "ユーザ登録に失敗しました。",
        err.message
      );
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseData);
    } else {
      const responseData = SystemError(
        "ユーザ登録に失敗しました。",
        "原因不明のエラー"
      );
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseData);
    }
  }
});

// ログイン
dUserRouter.post("/dlogin", async (req: Request, res: Response, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      logInfo("Missing parameters for login.", 90);
      return res.status(StatusCodes.BAD_REQUEST).json({
        resultCode: 90,
        message: "Please provide all the required parameters.",
        resultData: {
          fields: {
            email: email ? null : "Email is required.",
            password: password ? null : "Password is required.",
          },
        },
      });
    }

    const checkResult = await logic.checkEmailExists(email);
    if (!checkResult) {
      logInfo(`No user found for email: ${email}`, 90);
      return res.status(StatusCodes.NOT_FOUND).json({
        resultCode: 90,
        message: "No user exists with the email provided.",
        resultData: {
          hint: "Check if the email is correct or contact support.",
        },
      });
    }

    const comparePassword = await logic.comparePassword(email, password);
    if (!comparePassword) {
      logInfo("Incorrect password attempt.", 90);
      return res.status(StatusCodes.BAD_REQUEST).json({
        resultCode: 90,
        message: "Incorrect Password!",
        resultData: {
          hint: "Ensure the password is correct or reset your password.",
        },
      });
    }

    // トークン生成
    const tokens: TokenData = await logic.generateTokens(checkResult.id);
    const tokendata = {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      type: "Bearer",
    };

    const responseData = createSuccessResponse(
      "ログインに成功しました",
      tokendata
    );

    return res.status(StatusCodes.OK).json(responseData);
  } catch (error) {
    if (error instanceof Error) {
      logError(error, 99);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        resultCode: 99,
        message: error.message,
        resultData: {
          error: "Unexpected error occurred, please try again later.",
        },
      });
    } else {
      logError(new Error("An unknown error occurred"), 99);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        resultCode: 99,
        message: "An unknown error occurred",
        resultData: {
          error: "Unknown error, contact support.",
        },
      });
    }
  }
});

dUserRouter.post("/refreshToken", async (req: Request, res: Response, next) => {
  const { token } = req.body;

  if (!token) {
    return res.status(401).json({ error: "Refresh token is required" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET as string
    ) as JwtPayload;
    const result = await pool.query(
      "SELECT * FROM refresh_tokens WHERE token = $1",
      [token]
    );

    if (
      result.rows.length === 0 ||
      new Date(result.rows[0].expires_at) < new Date()
    ) {
      return res
        .status(403)
        .json({ error: "Invalid or expired refresh token" });
    }

    const userId = decoded.id;
    const tokens = await logic.generateTokens(userId);

    await pool.query("DELETE FROM refresh_tokens WHERE token = $1", [token]);

    await pool.query(
      "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
      [userId, tokens.refreshToken, tokens.refreshTokenExpiresAt]
    );

    const tokendata = {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      type: "Bearer",
    };

    const responseData = createSuccessResponse(
      "リフレッシュトークンの更新に成功しました。",
      tokendata
    );

    res.json(responseData);
  } catch (error) {
    console.error("Error refreshing token:", error);
    res.status(403).json({ error: "Invalid refresh token" });
  }
});

// 単一のユーザーを取得する(テスト用)
dUserRouter.get("/duser/:id", async (req: Request, res: Response) => {
  try {
    const user: UnitUser = await database.findOne(req.params.id);

    const bearToken = req.headers["authorization"];
    if (!bearToken) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "Authorization token is missing." });
    }
    const bearer = bearToken.split(" ");
    const token = bearer[1];

    jwt.verify(token, "secret", (error, user) => {
      if (error) {
        return res.sendStatus(403);
      }
      // else {
      //   return res.json({
      //     user,
      //   });
      // }
    });

    // if (!user) {
    //   return res
    //     .status(StatusCodes.NOT_FOUND)
    //     .json({ error: `User not found!` });
    // }

    return res.status(StatusCodes.OK).json({ user, aaa: "test" });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
});
