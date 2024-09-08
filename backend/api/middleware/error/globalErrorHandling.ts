import { Request, Response, NextFunction } from "express";
import { CustomError } from "./errorHandler";
import {
  SystemError,
  ApplicationError,
  ApiResponse,
  ResultCode,
} from "../../common/utils/response";

export const globalErrorHandling = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  let response: ApiResponse<void>;

  if (statusCode >= 500) {
    console.error(err.message); // エラーメッセージを内部ログに記録
    response = SystemError();
  } else {
    response = ApplicationError(err.message);
  }

  res.status(statusCode).json(response);
};
