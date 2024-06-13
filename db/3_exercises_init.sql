-- 既存の種目テーブルがある場合に削除
DROP TABLE IF EXISTS exercises;

-- 種目テーブルの作成
CREATE TABLE IF NOT EXISTS exercises (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    body_part_id INT NOT NULL,
    FOREIGN KEY (body_part_id) REFERENCES body_parts (id)
);

-- 種目データの挿入
INSERT INTO exercises (name, body_part_id) 
VALUES 
('Cable Crossover', 4),
('Chest Dip', 4),
('Chest Dip (Assisted)', 4),
('Chest Fly', 4),
('Chest Fly (Band)', 4),
('Chest Fly (Dumbbell)', 4),
('Chest Press (Band)', 4),
('Chest Press (Machine)', 4),
('Bent Over Row - Underhand (Barbell)', 3),
('Chin Up', 3),
('Box Jump', 5),
('Box Squat (Barbell)', 5),
('Bulgarian Split Squat', 5),
('ベンチプレス', 4),
('インクラインベンチプレス', 4),
('懸垂', 3),
('ラットプルダウン', 3),
('スクワット', 5),
('プランク', 1),
('アームカール', 2),
('デッドリフト', 3),
('ショルダープレス', 6);