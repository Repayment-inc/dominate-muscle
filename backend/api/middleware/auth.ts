/// <reference path="../types/express/index.d.ts" />

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface JwtPayload {
  id: string;
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
      if (err) {
        return res.sendStatus(403); // トークンが無効
      }
      req.user = user as JwtPayload; // JWTのペイロードをreq.userに格納
      console.log("Authenticated user:", req.user); // ログに出力
      console.log("【ユーザーID】req.user?.id =", req.user?.id); // ログに出力

      next();
    });
  } else {
    res.sendStatus(401); // トークンがない
  }
};

export default authMiddleware;
