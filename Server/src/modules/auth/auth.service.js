import bcrypt from "bcrypt";
import { getUserByName } from "../users/user.repository.js";
import { AppError } from "../../middleware/AppError.js";
import jwt from "jsonwebtoken";

const ADMIN_ROLE = 1;

export const authenticateByPin = async (username, pin) => {
  if (!username || !pin) {
    throw new AppError("Missing credentials", 400);
  }

  const user = await getUserByName(username);

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  if (!user.is_active) {
    throw new AppError("User inactive", 403);
  }

  const validPin = await bcrypt.compare(pin, user.pin_hash);

  if (!validPin) {
    throw new AppError("Invalid credentials", 401);
  }

  return {
    id: user.id,
    username: user.username,
    role_id: user.role_id,
  };
};

export const loginAdmin = async (username, password) => {
  if (!username || !password) throw new AppError("Missing credentials", 400);

  const user = await getUserByName(username);
  if (!user) throw new AppError("Invalid credentials", 401);
  if (!user.is_active) throw new AppError("User inactive", 403);

  // validate if user has admin role
  if (user.role_id !== ADMIN_ROLE) throw new AppError("Access denied", 403);

  const validPassword = await bcrypt.compare(password, user.password_hash);
  if (!validPassword) throw new AppError("Invalid credentials", 401);

  const payload = {
    id: user.id,
    username: user.username,
    role_id: user.role_id,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN ?? "1h",
  });

  return { token, user: payload };
};