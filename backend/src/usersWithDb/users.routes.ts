import express, { Request, Response } from "express";
import { UnitUser, User, JwtToken } from "./users.interface";
import { StatusCodes } from "http-status-codes";
import * as database from "./users.database";
import { pool } from "../db/database";
import jwt from "jsonwebtoken";
import * as dotevnv from "dotenv";
import { ApiResponse } from "../common/interface/apiResponse.interface";
import { logInfo, logError } from "../common/utils/logger";

export const dUserRouter = express.Router();

// ユーザーを登録する
dUserRouter.post("/dregister", async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: `Please provide all the required parameters..` });
    }

    const user = await database.findByEmail(email);

    if (user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: `This email has already been registered..` });
    }

    const newUser = await database.create(req.body);

    // Execute a SQL INSERT statement
    try {
      await pool.query(
        "INSERT INTO users (id, username, email, password) VALUES ($1, $2, $3, $4)",
        [newUser?.id, newUser?.username, newUser?.email, newUser?.password]
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          error:
            "Query error: " +
            "クエリが正常に処理されませんでした" +
            err.message,
        });
      } else {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          error: "Query error: " + "クエリが正常に処理されませんでした",
        });
      }
    }
    return res
      .status(StatusCodes.CREATED)
      .json({ message: "Task created successfully" });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
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

    const user = await database.findByEmail(email);
    if (!user) {
      logInfo(`No user found for email: ${email}`, 90);
      return res.status(StatusCodes.NOT_FOUND).json({
        resultCode: 90,
        message: "No user exists with the email provided.",
        resultData: {
          hint: "Check if the email is correct or contact support.",
        },
      });
    }

    const comparePassword = await database.comparePassword(email, password);
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

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      logError(new Error("JWT secret is undefined."), 99);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        resultCode: 99,
        message: "JWT secret is undefined.",
        resultData: {
          error: "Critical configuration error, contact system administrator.",
        },
      });
    }

    const jwtToken = jwt.sign({ id: user.id, email: user.email }, secret, {
      expiresIn: "1h",
    });
    const tokendata = { token: jwtToken, type: "Bearer" };
    const responseData: ApiResponse<typeof tokendata> = {
      resultCode: 0,
      message: "",
      resultData: tokendata,
    };

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
