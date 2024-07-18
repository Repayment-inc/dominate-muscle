-- 既存のテーブルがある場合に削除
-- DROP TABLE IF EXISTS refresh_tokens;
-- DROP TABLE IF EXISTS users;

-- ユーザーテーブルの作成
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

-- ユーザーデータの挿入
INSERT INTO users (username, email, password) 
VALUES 
('admin', 'admin@gmail.com', '$2a$10$yraCOyZ3Kg5VMLhCnRmqpuJW29MxjZqVPtR/eSt.IWjqeP30GI2RC'),
('admin2', 'admin2@gmail.com', '$2a$10$N7pg9q.wS8r40IkoIVEuWuWeRKKT.i/8yS0fWjjSakXmYi1vTHH82'),
('test', 'test@gmail.com', '$2a$10$78dldwbmbbX87Hd4QkinL.GjoWUiY7EXqlD6VZyeD/WIOZeDCjpRW');


-- Refresh Tokenテーブルの作成
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  token TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL
);
