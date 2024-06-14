import * as dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT as string, 10),
});

// //example
// export const pool = new Pool({
//   user: "admin",
//   host: "localhost",
//   password: "pass",
//   database: "muscleDb",
//   port: 5433,
// });
