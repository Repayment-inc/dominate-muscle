import { Pool } from "pg";

export const pool = new Pool({
  user: "admin",
  host: "localhost",
  password: "pass",
  database: "muscleDb",
  port: 5433,
});
