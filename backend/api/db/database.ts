import * as dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

// ローカル環境の場合、ローカルのDBを使う
const isProduction = process.env.NODE_ENV === "production";

// 本番環境はsupabase、それ以外はローカル
export const pool = new Pool({
  user: isProduction ? process.env.DATABASE_USER : process.env.DB_USER,
  host: isProduction ? process.env.DATABASE_HOST : process.env.DB_HOST,
  password: isProduction
    ? process.env.DATABASE_PASSWORD
    : process.env.DB_PASSWORD,
  database: isProduction ? process.env.DATABASE_DB_NAME : process.env.DB_NAME,
  port: isProduction
    ? parseInt(process.env.DATABASE_PORT as string, 10)
    : parseInt(process.env.DB_PORT as string, 10),
});

// export const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   port: parseInt(process.env.DB_PORT as string, 10),
// });
