import bcrypt from "bcrypt";
import { getUserByName } from "../models/user.model.js";

const ADMIN_ROLE_ID = 1;

export const authenticateEmployeeByPin = async (req, res, next) => {
  try {
    const { username, pin } = req.body;

    if (!username || !pin) {
      return res.status(400).json({ error: "Username and PIN are required" });
    }

    const user = await getUserByName(username);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!user.is_active) {
      return res.status(403).json({ error: "User is inactive" });
    }

    const validPin = await bcrypt.compare(pin, user.pin_hash);

    if (!validPin) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    req.user = {
      id: user.id,
      username: user.username,
      role_id: user.role_id,
    };

    next();
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const authenticateAdmin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    const user = await getUserByName(username);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!user.is_active) {
      return res.status(403).json({ error: "User is inactive" });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // verify if user is admin
    if (user.role_id !== ADMIN_ROLE_ID) {
      return res.status(403).json({ error: "Forbidden" });
    }

    req.user = {
      id: user.id,
      username: user.username,
      role_id: user.role_id,
    };

    next();
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};