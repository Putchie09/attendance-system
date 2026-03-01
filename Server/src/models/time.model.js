import { pool } from "../config/db.js";

export const getServerTime = async () => {
  const [rows] = await pool.query("SELECT NOW() as serverTime");
  return rows[0].serverTime;
};
