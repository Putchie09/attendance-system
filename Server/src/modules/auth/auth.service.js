import bcrypt from "bcrypt";
import { getUserByName } from "../users/user.repository.js";

export const authenticateByPin = async (username, pin) => {
  if (!username || !pin) {
    throw new Error("MISSING_CREDENTIALS");
  }

  const user = await getUserByName(username);

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  if (!user.is_active) {
    throw new Error("USER_INACTIVE");
  }

  const validPin = await bcrypt.compare(pin, user.pin_hash);

  if (!validPin) {
    throw new Error("INVALID_CREDENTIALS");
  }

  return {
    id: user.id,
    username: user.username,
    role_id: user.role_id,
  };
};
