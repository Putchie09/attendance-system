import { pool } from "../config/db.js";

export const createUser = async ({
  username,
  password_hash,
  pin_hash,
  role_id,
}) => {
  const [result] = await pool.query(
    "INSERT INTO app_user (username, password_hash, pin_hash, role_id, created_at) VALUES (?, ?, ?, ?, NOW())",
    [username, password_hash, pin_hash, role_id],
  );
  return result.insertId;
};

export const updateUserById = async ({
  id,
  username,
  role_id,
  is_active,
  password_hash,
  pin_hash,
}) => {
  let query = "UPDATE app_user SET ";
  const fields = [];
  const values = [];

  // Only include fields that are provided in the request body
  if (username !== undefined) {
    fields.push("username = ?");
    values.push(username);
  }

  if (role_id !== undefined) {
    fields.push("role_id = ?");
    values.push(role_id);
  }

  if (is_active !== undefined) {
    fields.push("is_active = ?");
    values.push(is_active);
  }

  if (password_hash !== undefined) {
    fields.push("password_hash = ?");
    values.push(password_hash);
  }
  if (pin_hash !== undefined) {
    fields.push("pin_hash = ?");
    values.push(pin_hash);
  }

  fields.push("updated_at = NOW()");

  // Construct the final query with each field
  query += fields.join(", ");
  query += " WHERE id = ?";
  values.push(id);

  const [result] = await pool.query(query, values);

  return result.affectedRows;
};

export const getUsers = async () => {
  const [rows] = await pool.query(
    "SELECT id, username, role_id, is_active FROM app_user",
  );
  return rows;
};

export const getUserById = async (id) => {
  const [rows] = await pool.query(
    "SELECT id, username, role_id, is_active FROM app_user WHERE id = ?",
    [id],
  );
  return rows[0];
};

export const getUserByName = async (username) => {
  const [rows] = await pool.query(
    "SELECT * FROM app_user WHERE username = ? LIMIT 1",
    [username],
  );
  return rows[0];
};

export const deleteUserById = async (id) => {
  const [result] = await pool.query("DELETE FROM app_user WHERE id = ?", [id]);
  return result.affectedRows;
};

export const getActiveUsersWithWorkingStatus = async () => {
  const [rows] = await pool.query(`
    SELECT 
      u.username,
      r.name AS role,
      CASE 
        WHEN att.type = 'IN' THEN 1
        ELSE 0
      END AS is_working
    FROM app_user u
    JOIN role r 
      ON r.id = u.role_id
    LEFT JOIN (
      SELECT a1.app_user_id, a1.type
      FROM attendance a1
      INNER JOIN (
        SELECT app_user_id, MAX(recorded_at) AS last_record
        FROM attendance
        GROUP BY app_user_id
      ) a2
        ON a1.app_user_id = a2.app_user_id
        AND a1.recorded_at = a2.last_record
    ) att ON att.app_user_id = u.id
    WHERE u.is_active = 1
    ORDER BY u.username ASC
  `);

  return rows;
};