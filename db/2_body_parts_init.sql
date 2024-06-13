-- 既存の部位テーブルがある場合に削除
DROP TABLE IF EXISTS body_parts;

-- 部位テーブルの作成
CREATE TABLE IF NOT EXISTS body_parts (
  id SERIAL PRIMARY KEY,
  part VARCHAR(50) UNIQUE NOT NULL
);

-- 部位データの挿入
INSERT INTO body_parts (part) 
VALUES 
('コア'), -- 1
('腕'), -- 2
('背中'), -- 3
('胸'), -- 4
('脚'), -- 5
('肩'); -- 6
