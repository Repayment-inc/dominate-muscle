import { HistoryData, Exercise } from "./workout.type";
import { pool } from "../db/database";
import { formatDate } from "../common/utils/utils";

// ワークアウト履歴取得
export const getWorkoutHistory = async (
  userid: number
): Promise<HistoryData> => {
  const result = await pool.query(
    `
      SELECT 
        u.id as user_id,
        u.username,
        wsessions.date,
        bp.id as body_part_id,
        bp.part as body_part_name,
        ex.id as exercise_id,
        ex.name as exercise_name,
        wsets.set_number,
        wsets.weight,
        wsets.reps
      FROM 
        users u
        JOIN workout_sessions wsessions ON u.id = wsessions.user_id
        JOIN workout_sets wsets ON wsessions.id = wsets.session_id
        JOIN exercises ex ON ex.id = wsets.exercise_id
        JOIN body_parts bp ON bp.id = ex.body_part_id
      WHERE
        u.id = $1
      ORDER BY 
        wsessions.date DESC;
      `,
    [userid]
  );

  const rawData = result.rows;

  // 返却用データ
  const historyData: HistoryData = { workoutHistory: [] };

  rawData.forEach((row) => {
    // 同じ日時のワークアウトを探す
    let workout = historyData.workoutHistory.find(
      (workout) => formatDate(workout.date) === formatDate(row.date)
    );
    if (!workout) {
      // 同じ日時のワークアウトが見つからない場合、新しいワークアウトを作成
      workout = {
        date: formatDate(row.date),
        workouts: [],
      };
      historyData.workoutHistory.push(workout);
    }

    // 同じ部位のワークアウトを探す
    let title = workout.workouts.find(
      (title) => title.title === row.body_part_name
    );
    // 同じ部位のワークアウトが見つからない場合、新しいワークアウトパートを作成
    if (!title) {
      title = { title: row.body_part_name, exercises: [] };
      workout.workouts.push(title);
    }

    // 同じエクササイズを探す
    let exercise = title.exercises.find(
      (exercise) => exercise.exerciseId === row.exercise_id
    );
    if (!exercise) {
      // 同じエクササイズが見つからない場合、新しいエクササイズを作成
      exercise = {
        exerciseId: row.exercise_id,
        exerciseName: row.exercise_name,
        partId: row.body_part_id,
        partName: row.body_part_name,
        sets: [],
      };
      title.exercises.push(exercise);
    }

    // エクササイズにセットを追加
    exercise.sets.push({
      setNumber: row.set_number,
      weight: row.weight,
      reps: row.reps,
    });
  });

  return historyData;
};

// ワークアウト情報登録
export const addWorkout = async (
  date: string,
  workout: Exercise[],
  userId: number
): Promise<void> => {
  const client = await pool.connect();
  try {
    // トランザクションを開始
    await client.query("BEGIN");

    // セッションの登録とid取得
    const workoutSessionRes = await client.query(
      "INSERT INTO workout_sessions (user_id, date) VALUES ($1, $2) RETURNING id",
      [userId, date]
    );
    const sessionId = workoutSessionRes.rows[0].id;
    console.log("sessionId = " + sessionId);

    for (const exercise of workout) {
      for (const set of exercise.sets) {
        await client.query(
          "INSERT INTO workout_sets (session_id, exercise_id, set_number, weight, reps) VALUES ($1, $2, $3, $4, $5)",
          [sessionId, exercise.exerciseId, set.setNumber, set.weight, set.reps]
        );
      }
    }

    await client.query("COMMIT");

    return;
  } catch (error) {
    // エラーが発生した場合、トランザクションをロールバック
    await client.query("ROLLBACK");
    console.error("ワークアウトの追加に失敗しました:", error);
    throw new Error("ワークアウトの追加に失敗しました");
  } finally {
    client.release();
  }
};
