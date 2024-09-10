import { z } from 'zod';

export const idSchema = z.number().int().positive();
export const emailSchema = z.string().email();
export const passwordSchema = z.string().min(4);
export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
  message: "日付の形式が正しくありません (YYYY-MM-DD)"
});