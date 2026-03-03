import bcrypt from "bcrypt";
import { getUserByName } from "../modules/users/user.repository.js";

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