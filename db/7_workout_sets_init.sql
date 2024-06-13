-- 既存のワークアウトセットテーブルがある場合に削除
DROP TABLE IF EXISTS workout_sets;

-- ワークアウトセットテーブルの作成
CREATE TABLE IF NOT EXISTS workout_sets (
  id SERIAL PRIMARY KEY,
  session_id INTEGER REFERENCES workout_sessions(id) ON DELETE CASCADE,
  -- exercise_id INTEGER REFERENCES user_exercises(id) ON DELETE CASCADE,
  exercise_id INTEGER REFERENCES exercises(id) ON DELETE CASCADE,
  set_number INTEGER NOT NULL,
  weight DECIMAL(5, 2) NOT NULL,
  reps INTEGER NOT NULL
);

-- ワークアウトセットデータの挿入
-- user1のセット情報を追加
INSERT INTO workout_sets (session_id, exercise_id, set_number, weight, reps) 
VALUES 
(1, 14, 1, 100.0, 10), -- 2023-04-01
(1, 14, 2, 100.0, 8),
(2, 16, 1, 50.0, 12), -- 2024-05-02
(2, 16, 2, 50.0, 10),
(3, 21, 1, 70.0, 10), -- 2024-06-03
(3, 21, 2, 60.0, 12),
(3, 21, 3, 60.0, 5),
(3, 18, 1, 30.0, 5);

-- user2のセット情報を追加
INSERT INTO workout_sets (session_id, exercise_id, set_number, weight, reps) 
VALUES 
(4, 5, 1, 80.0, 10), -- 2024-04-01
(4, 5, 2, 80.0, 8),
(5, 6, 1, 60.0, 12), -- 2024-05-02
(5, 6, 2, 60.0, 10);

-- user3のセット情報を追加
INSERT INTO workout_sets (session_id, exercise_id, set_number, weight, reps) 
VALUES 
(6, 7, 1, 90.0, 10), -- 2023-02-01
(6, 7, 2, 90.0, 8),
(7, 8, 1, 70.0, 12), -- 2024-05-02
(7, 8, 2, 70.0, 10);
