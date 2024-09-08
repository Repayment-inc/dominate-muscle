import express, { Router } from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { userRouter } from "./users/user.routes";
import { workoutsRouter } from "./workouts/workout.routes";
import { ApiResponse } from "./common/utils/response";
import { logError } from "./common/utils/logger";
import { exercisesRouter } from "./exercises/exercise.routes";
import { globalErrorHandling } from "./middleware/error/globalErrorHandling";

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

// app.get("/", (req, res) => res.send("Express on Vercel"));

app.use("/api/auth", userRouter);
app.use("/api/exercise", exercisesRouter);
app.use("/api/workouts", workoutsRouter);

// エラーハンドリングミドルウェア
app.use(globalErrorHandling);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
