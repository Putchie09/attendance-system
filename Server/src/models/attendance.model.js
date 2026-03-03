import { pool } from "../config/db.js";

export const getTodayAttendance = async (app_user_id) => {
  const [rows] = await pool.query(
    `
    SELECT id,
           app_user_id,
           type,
           recorded_at,
           updated_at,
           updated_by
    FROM attendance
    WHERE app_user_id = ?
      AND DATE(recorded_at) = CURDATE()
    ORDER BY recorded_at ASC
    `,
    [app_user_id],
  );

  return rows;
};

export const createAttendance = async (app_user_id, type) => {
  const [result] = await pool.query(
    `
    INSERT INTO attendance
    (app_user_id, type, recorded_at)
    VALUES (?, ?, NOW())
    `,
    [app_user_id, type],
  );

  return result.insertId;
};