import express, { Router } from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { userRouter } from "./users/users.routes";
import { productRouter } from "./products/product.routes";
import { dUserRouter } from "./usersWithDb/users.routes";
import { workoutsRouter } from "./workouts/workout.routes";
import { ApiResponse } from "./common/utils/response";
import { logError } from "./common/utils/logger";
import { exercisesRouter } from "./exercises/exercises.routes";
// import "./types"; // 型定義ファイルをインポート。しばらく様子見て、問題なければ削除で良い

dotenv.config();

if (!process.env.PORT) {
  console.log(`No port value specified...`);
}

// 環境変数PORTが設定されていない場合は3000を使用
const PORT = parseInt(process.env.PORT as string, 10) || 3000;

const app = express();

// CORS設定
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

// app.use("/api/auth", userRouter);
// app.use("/api/auth", productRouter);
app.use("/api/auth", dUserRouter);
app.use("/api/exercise", exercisesRouter);
app.use("/api/workouts", workoutsRouter);

//-------------------------

// エラーハンドリングミドルウェア　winston導入時に必要になるかも
// app.use(
//   (
//     err: Error,
//     req: express.Request,
//     res: express.Response,
//     next: express.NextFunction
//   ) => {
//     logError(err); // エラーメッセージをログに記録
//     const response: ApiResponse<null> = {
//       resultCode: err.message === "User not found" ? 90 : 99,
//       message: err.message,
//     };
//     res.status(500).json(response);
//   }
// );

app.get("/", (req, res) => res.send("Express on Vercel"));

// Vercel CLIでbuildする際はlistenを消してexport default appして、vercel.jsonを記載
// if (process.env.NODE_ENV !== "vercel") {
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
// }

// テストーーー
// const router = Router();
// router.get("/", (_, res) => {
//   res.json({
//     message: "Hello from express!",
//   });
// });

// router.get("/posts/:slug", (req, res) => {
//   res.json({
//     post: {
//       title: "Test Post",
//       slug: req.params["slug"],
//     },
//   });
// });
// app.use("/api/express", router);
// ここまでーーーーーーーーーーーーー
