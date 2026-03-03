import { pool } from "../config/db.js";

export const getTheme = async () => {
  const [rows] = await pool.query("SELECT theme FROM app_theme WHERE id = 1");

  if (rows.length === 0) return null;

  return rows[0].theme;
};

export const updateTheme = async (theme) => {
  const [result] = await pool.query(
    "UPDATE app_theme SET theme = ? WHERE id = 1",
    [theme],
  );

  return result.affectedRows;
};
