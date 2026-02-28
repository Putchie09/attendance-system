import { pool } from "../config/db.js";

export const getTodayAttendance = async (user_id) => {
  const [rows] = await pool.query(
    `
    SELECT id,
           user_id,
           type_id,
           status,
           recorded_at,
           created_at,
           ip_address
    FROM attendance
    WHERE user_id = ?
    AND DATE(recorded_at) = CURDATE()
    ORDER BY recorded_at ASC
    `,
    [user_id],
  );

  return rows;
};

export const createAttendance = async (user_id, type_id, ip_address) => {
  const [result] = await pool.query(
    `
    INSERT INTO attendance
    (user_id, type_id, ip_address, recorded_at, created_at)
    VALUES (?, ?, ?, NOW(), NOW())
    `,
    [user_id, type_id, ip_address],
  );

  return result.insertId;
};