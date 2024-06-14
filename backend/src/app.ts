import express from "express";
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

app.use("/api/auth", userRouter);
app.use("/api/auth", productRouter);
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

// vercel CLIでbuildする際はlistenを消してexport default　appして、verceltsを記載
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

// サーバーレス関数の数を減らすために統合
// export default app;
