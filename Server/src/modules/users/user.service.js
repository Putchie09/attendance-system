import bcrypt from "bcrypt";
import {
  createUser,
  updateUserById,
  getUsers,
  getUserById,
  deleteUserById,
  getActiveUsersWithWorkingStatus,
} from "./user.repository.js";
import { AppError } from "../../middleware/AppError.js";

const SALT_ROUNDS = 10;

export const registerUserService = async ({
  username,
  password,
  pin,
  role_id,
}) => {
  if (!username || !password || !pin || !role_id) {
    throw new AppError("Missing required fields", 400);
  }

  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
  const pin_hash = await bcrypt.hash(pin, SALT_ROUNDS);

  const userId = await createUser({
    username,
    password_hash,
    pin_hash,
    role_id,
  });

  return { id: userId, username, role_id };
};

export const updateUserService = async (id, data) => {
  const { username, password, pin, role_id, is_active } = data;

  // Validate that at least one field is provided for update
  if (
    username === undefined &&
    password === undefined &&
    pin === undefined &&
    role_id === undefined &&
    is_active === undefined
  ) {
    throw new AppError("Nothing to update", 400);
  }

  // encrypt password and pin if provided a new one
  let password_hash;
  if (password) {
    password_hash = await bcrypt.hash(password, SALT_ROUNDS);
  }

  let pin_hash;
  if (pin) {
    pin_hash = await bcrypt.hash(pin, SALT_ROUNDS);
  }

  const affectedRows = await updateUserById({
    id,
    username,
    role_id,
    is_active,
    password_hash,
    pin_hash,
  });

  if (affectedRows === 0) {
    throw new AppError("User not found", 404);
  }
};

export const listUsersService = async () => {
  return await getUsers();
};

export const getUserService = async (id) => {
  const user = await getUserById(id);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
};

export const deleteUserService = async (id) => {
  const affectedRows = await deleteUserById(id);
  // if no rows were affected, it means the user was not found
  if (affectedRows === 0) {
    throw new AppError("User not found", 404);
  }
};

export const listActiveUsersWithStatusService = async () => {
  return await getActiveUsersWithWorkingStatus();
};