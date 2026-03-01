import {
  createUser,
  updateUserById,
  getUsers,
  getUserById,
  deleteUserById,
  getUsersCurrentlyCheckedIn 
} from "../models/user.model.js";
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

export const listUsers = async (req, res) => {
  try {
    const users = await getUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await deleteUserById(id);
    // if no rows were affected, it means the user was not found
    if (affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const listUsersCurrentlyCheckedIn = async (req, res) => {
  try {
    const users = await getUsersCurrentlyCheckedIn();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};