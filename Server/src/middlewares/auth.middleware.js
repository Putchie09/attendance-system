import bcrypt from "bcrypt";
import { getUserByName } from "../models/user.model.js";

export const authenticateUser = async (req, res, next) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ error: "Name and password are required" });
    }

    const user = await getUserByName(name);

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

    //save authenticated user in request
    req.user = {
      id: user.id,
      name: user.name,
      role_id: user.role_id,
    };

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
