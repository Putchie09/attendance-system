import { pool } from "../../config/db.js";

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

export const getAllAttendance = async () => {
  const [rows] = await pool.query(`
    SELECT 
      a.id,
      u.username AS usuario,
      a.type AS tipo,
      DATE_FORMAT(a.recorded_at,'%d/%m/%Y') AS fecha,
      DATE_FORMAT(a.recorded_at,'%H:%i') AS hora
    FROM attendance a
    JOIN app_user u ON u.id = a.app_user_id
    ORDER BY a.recorded_at DESC
  `);

  return rows;
};

// Trae todos los registros IN/OUT de una fecha específica (yyyy-mm-dd),
// crudos (sin formatear), para poder calcular horas trabajadas en el service.
export const getAttendanceByDate = async (dateStr) => {
  const [rows] = await pool.query(
    `
    SELECT a.id, a.app_user_id, a.type, a.recorded_at
    FROM attendance a
    WHERE DATE(a.recorded_at) = ?
    ORDER BY a.recorded_at ASC
    `,
    [dateStr],
  );

  return rows;
};