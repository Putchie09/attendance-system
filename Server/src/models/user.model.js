import { pool } from "../config/db.js";


export const createUser = async ({ name, password_hash, role_id }) => {
  const [result] = await pool.query(
    "INSERT INTO user (name, password_hash, role_id, created_at) VALUES (?, ?, ?, NOW())",
    [name, password_hash, role_id],
  );
  return result.insertId;
};


export const updateUserById = async ({
  id,
  name,
  role_id,
  is_active,
  password_hash,
}) => {
  let query = "UPDATE user SET ";
  const fields = [];
  const values = [];

  // Only include fields that are provided in the request body
  if (name !== undefined) {
    fields.push("name = ?");
    values.push(name);
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
    "SELECT id, name, role_id, is_active FROM user",
  );
  return rows;
};


export const getUserById = async (id) => {
  const [rows] = await pool.query(
    "SELECT id, name, role_id, is_active FROM user WHERE id = ?",
    [id],
  );
  return rows[0];
};