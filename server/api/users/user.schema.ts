import { z } from "zod";
import { idSchema, emailSchema, passwordSchema } from "../common/schemas";
import { max } from "date-fns";
import { body } from "express-validator";

const BaseUserSchema = z.object({
    body: z.object({
    email: emailSchema,
    password: passwordSchema,
  }),
});

export const UserSchema = BaseUserSchema.extend({
  body: z.object({
    username: z.string().min(3).max(20),
  }),
});

export const LoginSchema = BaseUserSchema;