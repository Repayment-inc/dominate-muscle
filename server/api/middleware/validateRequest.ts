import { z } from "zod";
import { Request, Response, NextFunction } from "express";
import { ApplicationError } from "../common/utils/response";

export const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(error);
      }
      next(error);
    }
  };
};