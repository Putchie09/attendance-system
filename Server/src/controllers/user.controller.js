import { createUser, updateUserById } from "../models/user.model.js";
import bcrypt from "bcrypt";

export const registerUser = async (req, res) => {
  try {
    const { name, password, role_id } = req.body;

    if (!name || !password || !role_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // encrypt password
    const password_hash = await bcrypt.hash(password, 10);

    const userId = await createUser({ name, password_hash, role_id });
    // Return the created user ID
    res
      .status(201)
      .location(`/api/users/${userId}`)
      .json({ id: userId, name, role_id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, password, role_id, is_active } = req.body;

    if (!name && !password && !role_id && is_active === undefined) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    // encrypt password if provided a new one
    let password_hash;
    if (password) {
      password_hash = await bcrypt.hash(password, 10);
    }

    // Update the user and check if any rows were affected
    const affectedRows = await updateUserById({
      id,
      name,
      role_id,
      is_active,
      password_hash,
    });
    if (affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
