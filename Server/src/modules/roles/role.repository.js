import { pool } from "../../config/db.js";

export const createRole = async ({ name }) => {
  const [result] = await pool.query(
    "INSERT INTO role (name, created_at) VALUES (?, NOW())",
    [name],
    );
    return result.insertId;
};

export const updateRoleById = async ({ id, name }) => {
    const [result] = await pool.query(
        "UPDATE role SET name = ?, updated_at = NOW() WHERE id = ?",
        [name, id],
    );
    return result.affectedRows;
};

export const getRoles = async () => {
  const [rows] = await pool.query(
    "SELECT id, name FROM role",
  );
  return rows;
};

export const getRoleById = async (id) => {
  const [rows] = await pool.query(
    "SELECT id, name FROM role WHERE id = ?",
    [id],
  );
  return rows[0];
};

export const deleteRoleById = async (id) => {
  const [result] = await pool.query(
    "DELETE FROM role WHERE id = ?",
    [id],
    );
    return result.affectedRows;
};
