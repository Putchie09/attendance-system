import bcrypt from "bcrypt";
import { getUserByName } from "../users/user.repository.js";
import { AppError } from "../../middleware/AppError.js";

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
