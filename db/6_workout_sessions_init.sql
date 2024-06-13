-- 既存のワークアウトセッションテーブルがある場合に削除
DROP TABLE IF EXISTS workout_sessions;

-- ワークアウトセッションテーブルの作成
CREATE TABLE IF NOT EXISTS workout_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL
);

-- ワークアウトセッションデータの挿入
-- user1のワークアウトセッションを追加
INSERT INTO workout_sessions (user_id, date) VALUES (1, '2023-04-01');
INSERT INTO workout_sessions (user_id, date) VALUES (1, '2024-05-02');
INSERT INTO workout_sessions (user_id, date) VALUES (1, '2024-06-03');

-- user2のワークアウトセッションを追加
INSERT INTO workout_sessions (user_id, date) VALUES (2, '2024-04-01');
INSERT INTO workout_sessions (user_id, date) VALUES (2, '2024-05-02');

-- user3のワークアウトセッションを追加
INSERT INTO workout_sessions (user_id, date) VALUES (3, '2023-02-01');
INSERT INTO workout_sessions (user_id, date) VALUES (3, '2024-05-02');
