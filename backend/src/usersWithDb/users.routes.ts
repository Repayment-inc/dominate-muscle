import express, { Request, Response } from "express";
import { UnitUser, User } from "./users.interface";
import { StatusCodes } from "http-status-codes";
import * as database from "./users.database";
import { pool } from "../db/database";

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
