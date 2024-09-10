import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { CustomError } from './errorHandler';
import { SystemError, ApplicationError, ApiResponse } from '../../common/utils/response';

export const globalErrorHandling = (
  err: Error | ZodError | CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let response: ApiResponse<void>;

  if (err instanceof ZodError) {
    console.log(err.errors);
    response = ApplicationError(err.errors.map(e => e.message).join(', '));
    return res.status(400).json(response);
  }

  if (err instanceof CustomError) {
    const statusCode = err.statusCode || 500;
    response = statusCode >= 500 ? SystemError() : ApplicationError(err.message);
    return res.status(statusCode).json(response);
  }

  console.error(err);
  response = SystemError();
  res.status(500).json(response);
};