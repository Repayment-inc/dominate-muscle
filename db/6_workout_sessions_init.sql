-- 既存のワークアウトセッションテーブルがある場合に削除
DROP TABLE IF EXISTS workout_sessions;

-- ワークアウトセッションテーブルの作成
CREATE TABLE IF NOT EXISTS workout_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL
);

-- ワークアウトセッションデータの挿入
INSERT INTO workout_sessions(user_id,"date") VALUES 
    (1,DATE '2023-04-01')
  , (1,DATE '2024-05-02')
  , (1,DATE '2024-06-03')
  , (2,DATE '2024-04-01')
  , (2,DATE '2024-05-02')
  , (3,DATE '2023-02-01')
  , (3,DATE '2024-05-02')
  , (1,DATE '2024-06-04')
  , (1,DATE '2024-06-05')
  , (1,DATE '2024-06-06')
  , (1,DATE '2024-06-07')
  , (1,DATE '2024-06-11')
  , (1,DATE '2024-06-12')
  , (1,DATE '2024-06-20')
  , (1,DATE '2024-06-23')
  , (1,DATE '2024-06-24')
  , (1,DATE '2024-05-16')
  , (1,DATE '2024-05-16')
  , (1,DATE '2024-05-02')
  , (1,DATE '2024-05-22')
  , (1,DATE '2024-06-28');
