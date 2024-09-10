import {
  HistoryData,
  AddWorkoutType,
  EditWorkoutType,
} from "./workout.type";
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
        wsessions.id as session_id,
        wsessions.session_title,
        wsessions.date,
        bp.id as body_part_id,
        bp.part as body_part_name,
        ex.id as exercise_id,
        ex.name as exercise_name,
        wsets.exercise_order,
        wsets.id as set_id,
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
        wsessions.date DESC,
        wsets.exercise_order ASC;
      `,
    [userid]
  );

  const rawData = result.rows;

  // 返却用データ
  const historyData: HistoryData = { workoutHistory: [] };

  rawData.forEach((row) => {
    // 同じ日時のワークアウトを探す
    let workout = historyData.workoutHistory.find(
      // 以前は日付ごとに履歴を取ってた。　不要そうなら削除する。
      // (workout) => formatDate(workout.date) === formatDate(row.date)
      (workout) => workout.sessionId === row.session_id
    );
    if (!workout) {
      // 同じ日時のワークアウトが見つからない場合、新しいワークアウトを作成
      workout = {
        sessionId: row.session_id,
        sessionTitle: row.session_title,
        date: formatDate(row.date),
        workouts: [],
      };
      historyData.workoutHistory.push(workout);
    }

    // ----- 同じワークアウトセッションを探す -----
    // let session = workout.workouts.find(
    //   (session) => session.sessionId === row.session_id
    // );
    // // 同じ部位のワークアウトが見つからない場合、新しいワークアウトセッションを作成
    // if (!session) {
    //   session = {
    //     sessionId: row.session_id,
    //     sessionTitle: row.session_title,
    //     exercises: [],
    //   };
    //   workout.workouts.push(session);
    // }
    // -----------------------------------

    // 同じエクササイズを探す
    let exercise = workout.workouts.find(
      (exercise) => exercise.exerciseId === row.exercise_id
    );
    if (!exercise) {
      // 同じエクササイズが見つからない場合、新しいエクササイズを作成
      exercise = {
        exerciseId: row.exercise_id,
        exerciseName: row.exercise_name,
        partId: row.body_part_id,
        partName: row.body_part_name,
        exerciseOrder: row.exercise_order,
        sets: [],
      };
      workout.workouts.push(exercise);
    }

    // エクササイズにセットを追加
    exercise.sets.push({
      setId: row.set_id,
      setNumber: row.set_number,
      weight: row.weight,
      reps: row.reps,
    });
  });

  return historyData;
};

// ワークアウト情報登録
export const addWorkout = async ({
  date,
  sessionTitle,
  workouts,
  userId,
}: AddWorkoutType): Promise<void> => {
  const client = await pool.connect();
  try {
    // トランザクションを開始
    await client.query("BEGIN");

    // セッションの登録とid取得
    const workoutSessionRes = await client.query(
      "INSERT INTO workout_sessions (session_title, user_id, date) VALUES ($1, $2, $3) RETURNING id",
      [sessionTitle, userId, date]
    );
    const sessionId = workoutSessionRes.rows[0].id;
    console.log("sessionId = " + sessionId);

    let exerciseOrder = 1;
    for (const exercise of workouts) {
      for (const set of exercise.sets) {
        console.log(exerciseOrder);
        await client.query(
          "INSERT INTO workout_sets (session_id, exercise_id, exercise_order, set_number, weight, reps) VALUES ($1, $2, $3, $4, $5, $6)",
          [
            sessionId,
            exercise.exerciseId,
            exerciseOrder,
            set.setNumber,
            set.weight,
            set.reps,
          ]
        );
        exerciseOrder++;
      }
    }

    await client.query("COMMIT");

    return;
  } catch (error) {
    // エラーが発生した場合、トランザクションをロールバック
    await client.query("ROLLBACK");
    console.error("ワークアウトの追加に失敗しました:", error);
    // throw new Error("ワークアウトの追加に失敗しました");
    throw error; // 元のエラーをそのままスロー
  } finally {
    client.release();
  }
};

// ワークアウト情報削除
export const deleteWorkout = async (
  date: string,
  userId: number
): Promise<void> => {
  const client = await pool.connect();
  try {
    // トランザクションを開始
    await client.query("BEGIN");

    // セッションの削除とid取得
    const workoutSessionRes = await client.query(
      "DELETE FROM workout_sessions WHERE user_id = $1 AND date = $2 RETURNING id",
      [userId, date]
    );
    const sessionId = workoutSessionRes.rows[0].id;
    console.log("sessionId = " + sessionId);

    await client.query("DELETE FROM workout_sets WHERE session_id = $1", [
      sessionId,
    ]);

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

// ワークアウト情報編集
export const updateWorkout = async ({
  sessionId,
  date,
  sessionTitle,
  workouts,
}: // userId,
EditWorkoutType): Promise<void> => {
  const client = await pool.connect();
  try {
    // トランザクションを開始
    await client.query("BEGIN");

    // ワークアウトセッションテーブルの更新
    if (sessionTitle || date) {
      const updateFields: string[] = [];
      const updateValues: (string | number)[] = [];
      let query = "UPDATE workout_sessions SET ";

      if (date) {
        updateFields.push("date = $1");
        updateValues.push(date);
      }

      if (sessionTitle) {
        updateFields.push("session_title = $" + (updateValues.length + 1));
        updateValues.push(sessionTitle);
      }

      query +=
        updateFields.join(", ") + " WHERE id = $" + (updateValues.length + 1);
      updateValues.push(sessionId);

      await client.query(query, updateValues);
    }

    // 現在のセットを取得し、マップに保存する
    const existingSetsResult = await client.query(
      "SELECT id, exercise_id FROM workout_sets WHERE session_id = $1 ORDER BY exercise_order ASC",
      [sessionId]
    );
    const existingSetsMap = new Map<number, { exerciseId: number }>();
    for (const row of existingSetsResult.rows) {
      existingSetsMap.set(row.id, { exerciseId: row.exercise_id });
    }

    // セットを処理する
    let exerciseOrder = 1;
    for (const exercise of workouts) {
      let setNumber = 1;
      for (const set of exercise.sets) {
        if (set.status === "new") {
          // 新規追加の場合
          await client.query(
            "INSERT INTO workout_sets (session_id, exercise_id, exercise_order, set_number, weight, reps) VALUES ($1, $2, $3, $4, $5, $6)",
            [
              sessionId,
              exercise.exerciseId,
              exerciseOrder,
              setNumber,
              set.weight,
              set.reps,
            ]
          );
        } else if (set.status === "updated") {
          // 更新の場合
          await client.query(
            "UPDATE workout_sets SET exercise_id = $1, set_number = $2, weight = $3, reps = $4, exercise_order = $5 WHERE id = $6 AND session_id = $7",
            [
              exercise.exerciseId,
              setNumber,
              set.weight,
              set.reps,
              exerciseOrder,
              set.setId,
              sessionId,
            ]
          );
        } else if (set.status === "unchanged") {
          // 未変更の場合、順序を更新
          await client.query(
            "UPDATE workout_sets SET exercise_order = $1, set_number = $2 WHERE id = $3 AND session_id = $4",
            [exerciseOrder, setNumber, set.setId, sessionId]
          );
        }
        setNumber++;
        exerciseOrder++;
      }
    }

    // 削除されたセットを処理する
    for (const [id] of existingSetsMap.entries()) {
      if (
        !workouts.some((exercise) =>
          exercise.sets.some(
            (set) => set.setId === id && set.status !== "deleted"
          )
        )
      ) {
        await client.query(
          "DELETE FROM workout_sets WHERE id = $1 AND session_id = $2",
          [id, sessionId]
        );
      }
    }

    // 再計算後、連番を再設定
    exerciseOrder = 1;
    for (const exercise of workouts) {
      let setNumber = 1;
      const result = await client.query(
        "SELECT id FROM workout_sets WHERE session_id = $1 AND exercise_id = $2 ORDER BY exercise_order ASC",
        [sessionId, exercise.exerciseId]
      );

      for (const row of result.rows) {
        await client.query(
          "UPDATE workout_sets SET exercise_order = $1, set_number = $2 WHERE id = $3",
          [exerciseOrder, setNumber, row.id]
        );
        setNumber++;
        exerciseOrder++;
      }
    }

    await client.query("COMMIT");

    return;
  } catch (error) {
    // エラーが発生した場合、トランザクションをロールバック
    await client.query("ROLLBACK");
    console.error("ワークアウトの編集に失敗しました:", error);
    throw new Error("ワークアウトの編集に失敗しました");
  } finally {
    client.release();
  }
};
