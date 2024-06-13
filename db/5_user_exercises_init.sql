-- -- これはユーザー用に胸のメニュー、肩のメニュー、みたいなテンプレート機能を実装する時に使用予定

-- -- 既存のユーザー種目テーブルがある場合に削除
-- DROP TABLE IF EXISTS user_exercises;

-- -- ユーザー種目テーブルの作成
-- CREATE TABLE IF NOT EXISTS user_exercises (
--   id SERIAL PRIMARY KEY,
--   user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
--   part_id INTEGER REFERENCES body_parts(id) ON DELETE CASCADE,
--   exercise_id INTEGER REFERENCES exercises(id) ON DELETE CASCADE
-- );

-- -- ユーザー種目データの挿入
-- -- user1の種目
-- INSERT INTO user_exercises (user_id, part_id, exercise_id) 
-- VALUES 
-- (1, 1, 1), -- 胸 - ベンチプレス
-- (1, 1, 2), -- 胸 - インクラインダンベルプレス
-- (1, 2, 3), -- 背中 - 懸垂
-- (1, 2, 4), -- 背中 - ラットプルダウン
-- (1, 3, 5); -- 脚 - スクワット

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
-- (3, 3, 5); -- 脚 - スクワット
