-- -- 既存のテーブルがある場合に削除
-- DROP TABLE IF EXISTS workout_sets;
-- DROP TABLE IF EXISTS workout_sessions;
-- DROP TABLE IF EXISTS user_exercises;
-- DROP TABLE IF EXISTS exercises;
-- DROP TABLE IF EXISTS user_parts;
-- DROP TABLE IF EXISTS body_parts;
-- DROP TABLE IF EXISTS users;

-- -- ユーザーテーブル
-- CREATE TABLE IF NOT EXISTS users (
--   id SERIAL PRIMARY KEY,
--   username VARCHAR(255) UNIQUE NOT NULL,
--   email VARCHAR(255) UNIQUE NOT NULL,
--   password VARCHAR(255) NOT NULL
-- );

-- -- 部位テーブル
-- CREATE TABLE IF NOT EXISTS body_parts (
--   id SERIAL PRIMARY KEY,
--   part VARCHAR(50) UNIQUE NOT NULL
-- );

-- -- ユーザー部位テーブル
-- CREATE TABLE IF NOT EXISTS user_parts (
--   id SERIAL PRIMARY KEY,
--   user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
--   part_id INTEGER REFERENCES body_parts(id) ON DELETE CASCADE
-- );

-- -- 種目テーブル
-- CREATE TABLE exercises (
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(100) NOT NULL,
--     body_part_id INT NOT NULL,
--     FOREIGN KEY (body_part_id) REFERENCES body_parts (id)
-- );

-- -- ユーザー種目テーブル (→ユーザーオリジナルmenuテーブル　or　登録ルーティンtableに変えようかな。)
-- CREATE TABLE IF NOT EXISTS user_exercises (
--   id SERIAL PRIMARY KEY,
--   user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
--   part_id INTEGER REFERENCES body_parts(id) ON DELETE CASCADE,
--   exercise_id INTEGER REFERENCES exercises(id) ON DELETE CASCADE
-- );

-- -- ワークアウトセッションテーブル
-- CREATE TABLE IF NOT EXISTS workout_sessions (
--   id SERIAL PRIMARY KEY,
--   user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
--   date DATE NOT NULL
-- );

-- -- ワークアウトセットテーブル
-- CREATE TABLE IF NOT EXISTS workout_sets (
--   id SERIAL PRIMARY KEY,
--   session_id INTEGER REFERENCES workout_sessions(id) ON DELETE CASCADE,
--   exercise_id INTEGER REFERENCES user_exercises(id) ON DELETE CASCADE,
--   set_number INTEGER NOT NULL,
--   weight DECIMAL(5, 2) NOT NULL,
--   reps INTEGER NOT NULL
-- );

-- -- インデックスの追加
-- CREATE INDEX idx_workout_sessions_user_id_date ON workout_sessions(user_id, date);
-- CREATE INDEX idx_workout_sets_exercise_id ON workout_sets(exercise_id);
-- CREATE INDEX idx_user_exercises_user_id_part_id ON user_exercises(user_id, part_id);

-- -- ユーザーのトレーニングデータを簡単に取得するためのビュー
-- CREATE VIEW workout_view AS
-- SELECT 
--     ws.id AS workout_set_id,
--     u.username,
--     u.email,
--     u.id AS user_id,
--     wss.date,
--     bp.part,
--     e.name AS exercise,
--     ws.set_number,
--     ws.weight,
--     ws.reps
-- FROM 
--     workout_sets ws
-- JOIN 
--     workout_sessions wss ON ws.session_id = wss.id
-- JOIN 
--     user_exercises ue ON ws.exercise_id = ue.id
-- JOIN 
--     exercises e ON ue.exercise_id = e.id
-- JOIN 
--     body_parts bp ON ue.part_id = bp.id
-- JOIN 
--     users u ON wss.user_id = u.id;




-- INSERT INTO users (username, email, password) 
-- VALUES 
-- ('user1', 'user1@example.com', 'password123'),
-- ('user2', 'user2@example.com', 'password123'),
-- ('user3', 'user3@example.com', 'password123');

-- INSERT INTO body_parts (part) 
-- VALUES 
-- ('コア'), -- 1
-- ('腕'), -- 2
-- ('背中'), -- 3
-- ('胸'), -- 4
-- ('脚'), -- 5
-- ('肩'); -- 6


-- INSERT INTO exercises (name, body_part_id) 
-- VALUES 
-- ('ベンチプレス', 4),
-- ('インクラインダンベルプレス', 4),
-- ('懸垂', 3),
-- ('ラットプルダウン', 3),
-- ('スクワット', 5),
-- ('プランク', 1),
-- ('アームカール', 2),
-- ('デッドリフト', 3),
-- ('ショルダープレス', 6);

-- -- user1の部位
-- INSERT INTO user_parts (user_id, part_id) 
-- VALUES 
-- (1, 1), -- 胸
-- (1, 2), -- 背中
-- (1, 3); -- 足

-- -- user2の部位
-- INSERT INTO user_parts (user_id, part_id) 
-- VALUES 
-- (2, 1), -- 胸
-- (2, 2); -- 背中

-- -- user3の部位
-- INSERT INTO user_parts (user_id, part_id) 
-- VALUES 
-- (3, 1), -- 胸
-- (3, 3); -- 足


-- -- user1の種目
-- INSERT INTO user_exercises (user_id, part_id, exercise_id) 
-- VALUES 
-- (1, 1, 1), -- 胸 - ベンチプレス
-- (1, 1, 2), -- 胸 - インクラインダンベルプレス
-- (1, 2, 3), -- 背中 - 懸垂
-- (1, 2, 4), -- 背中 - ラットプルダウン
-- (1, 3, 5); -- 足 - スクワット

-- -- user2の種目
-- INSERT INTO user_exercises (user_id, part_id, exercise_id) 
-- VALUES 
-- (2, 1, 1), -- 胸 - ベンチプレス
-- (2, 1, 2), -- 胸 - インクラインダンベルプレス
-- (2, 2, 3), -- 背中 - 懸垂
-- (2, 2, 4); -- 背中 - ラットプルダウン

-- -- user3の種目
-- INSERT INTO user_exercises (user_id, part_id, exercise_id) 
-- VALUES 
-- (3, 1, 1), -- 胸 - ベンチプレス
-- (3, 3, 5); -- 足 - スクワット


-- -- user1のワークアウトセッションを追加
-- INSERT INTO workout_sessions (user_id, date) VALUES (1, '2024-05-01');
-- INSERT INTO workout_sessions (user_id, date) VALUES (1, '2024-05-02');
-- INSERT INTO workout_sessions (user_id, date) VALUES (1, '2024-05-03');

-- -- user1のセット情報を追加
-- INSERT INTO workout_sets (session_id, exercise_id, set_number, weight, reps) 
-- VALUES 
-- (1, 1, 1, 100.0, 10), -- 2024-05-01
-- (1, 1, 2, 100.0, 8),
-- (2, 2, 1, 50.0, 12), -- 2024-05-02
-- (2, 2, 2, 50.0, 10),
-- (3, 3, 1, 70.0, 10), -- 2024-05-03
-- (3, 4, 1, 60.0, 12);

-- -- user2のワークアウトセッションを追加
-- INSERT INTO workout_sessions (user_id, date) VALUES (2, '2024-05-01');
-- INSERT INTO workout_sessions (user_id, date) VALUES (2, '2024-05-02');

-- -- user2のセット情報を追加
-- INSERT INTO workout_sets (session_id, exercise_id, set_number, weight, reps) 
-- VALUES 
-- (4, 5, 1, 80.0, 10), -- 2024-05-01
-- (4, 5, 2, 80.0, 8),
-- (5, 6, 1, 60.0, 12), -- 2024-05-02
-- (5, 6, 2, 60.0, 10);

-- -- user3のワークアウトセッションを追加
-- INSERT INTO workout_sessions (user_id, date) VALUES (3, '2024-05-01');
-- INSERT INTO workout_sessions (user_id, date) VALUES (3, '2024-05-02');

-- -- user3のセット情報を追加
-- INSERT INTO workout_sets (session_id, exercise_id, set_number, weight, reps) 
-- VALUES 
-- (6, 7, 1, 90.0, 10), -- 2024-05-01
-- (6, 7, 2, 90.0, 8),
-- (7, 8, 1, 70.0, 12), -- 2024-05-02
-- (7, 8, 2, 70.0, 10);












-- -----------------------------------------

-- -- INSERT INTO exercises (workout_part_id, name) VALUES (3, 'スクワット');
-- -- INSERT INTO exercises (workout_part_id, name) VALUES (3, 'インナーアブダクション');
-- -- INSERT INTO exercises (workout_part_id, name) VALUES (3, 'アウターアブダクション');

