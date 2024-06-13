-- ユーザーが体の部位を自分で登録、参照、削除する用で使おうとしたが、やっぱいらない。

-- -- 既存のユーザー部位テーブルがある場合に削除
-- DROP TABLE IF EXISTS user_parts;

-- -- ユーザー部位テーブルの作成
-- CREATE TABLE IF NOT EXISTS user_parts (
--   id SERIAL PRIMARY KEY,
--   user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
--   part_id INTEGER REFERENCES body_parts(id) ON DELETE CASCADE
-- );

-- -- ユーザー部位データの挿入
-- -- user1の部位
-- INSERT INTO user_parts (user_id, part_id) 
-- VALUES 
-- (1, 1), -- コア
-- (1, 2), -- 背中
-- (1, 3); -- 脚

-- -- user2の部位
-- INSERT INTO user_parts (user_id, part_id) 
-- VALUES 
-- (2, 1), -- コア
-- (2, 2); -- 背中

-- -- user3の部位
-- INSERT INTO user_parts (user_id, part_id) 
-- VALUES 
-- (3, 1), -- コア
-- (3, 3); -- 脚
