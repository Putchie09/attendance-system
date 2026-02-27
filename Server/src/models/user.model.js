import { pool } from '../config/db.js';

export const createUser = async ({ name, password_hash, role_id }) => {
    const [result] = await pool.query(
        'INSERT INTO user (name, password_hash, role_id, created_at) VALUES (?, ?, ?, NOW())',
        [name, password_hash, role_id]
    );
    return result.insertId;
};