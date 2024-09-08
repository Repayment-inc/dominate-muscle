import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
  console.log("本番環境を使用します");
} else {
  console.log("ローカル環境を使用します");
}
// 本番環境はsupabase、それ以外はローカルDBを使用
export const pool = new Pool({
  user: isProduction ? process.env.DATABASE_USER : process.env.DB_USER,
  host: isProduction ? process.env.DATABASE_HOST : process.env.DB_HOST,
  password: isProduction
    ? process.env.DATABASE_PASSWORD
    : process.env.DB_PASSWORD,
  database: isProduction ? process.env.DATABASE_NAME : process.env.DB_NAME,
  port: isProduction
    ? parseInt(process.env.DATABASE_PORT as string, 10)
    : parseInt(process.env.DB_PORT as string, 10),
  //   max: 20, // 最大接続数
  //   idleTimeoutMillis: 30000, // アイドル状態のタイムアウト
  connectionTimeoutMillis: 30000, // 接続のタイムアウト
  //   ssl: {
  //     rejectUnauthorized: false,
  //   },
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error(
      "クライアントの取得中にエラーが発生しました",
      err.stack
    );
  }
  if (!client) {
    return console.error("クライアントが未定義です");
  }
  client.query("SELECT NOW()", (err, result) => {
    release();
    if (err) {
      return console.error("クエリ実行時にエラーが発生しました", err.stack);
    }
    console.log(result.rows);
  });
});

pool.on("error", (err) => {
  console.error(
    "アイドル状態のクライアントで予期しないエラーが発生しました",
    err
  );
  process.exit(-1);
});
