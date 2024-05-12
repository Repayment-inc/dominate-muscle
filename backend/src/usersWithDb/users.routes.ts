import express, { Request, Response } from "express";
import { UnitUser, User } from "./users.interface";
import { StatusCodes } from "http-status-codes";
import * as database from "./users.database";
import { pool } from "../db/database";
import jwt from "jsonwebtoken";
import * as dotevnv from "dotenv";

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
dUserRouter.post("/dlogin", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 入力チェック
    if (!email || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Please provide all the required parameters.." });
    }

    const user = await database.findByEmail(email);

    // emailに対応するuserが見つからない場合
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "No user exists with the email provided.." });
    }

    const comparePassword = await database.comparePassword(email, password);

    if (!comparePassword) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: `Incorrect Password!` });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "JWT secret is undefined." });
    }

    // 有効期限1時間のトークン発行
    const token = jwt.sign({ id: user.id, email: user.email }, secret, {
      expiresIn: "1h",
    });

    return res.status(StatusCodes.OK).json({ token, type: "Bearer" });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
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
