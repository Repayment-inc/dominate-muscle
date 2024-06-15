      SELECT 
        u.id as user_id,
        u.username,
        wsessions.date,
        bp.id as body_part_id,
        bp.part as body_part_name,
        ex.id as exercise_id,
        ex.name as exercise_name,
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
        u.id = 1
      ORDER BY 
        wsessions.date DESC;


        


SELECT 
    ex.id,
    ex.name,
    ex.body_part_id,
    bp.part AS body_part_name
FROM 
    exercises ex
JOIN 
    body_parts bp ON ex.body_part_id = bp.id
