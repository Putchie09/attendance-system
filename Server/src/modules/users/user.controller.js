import { asyncHandler } from "../../middleware/asyncHandler.js";
import {
  registerUserService,
  updateUserService,
  listUsersService,
  getUserService,
  deleteUserService,
  listActiveUsersWithStatusService,
} from "./user.service.js";

export const registerUser = asyncHandler(async (req, res) => {
  const user = await registerUserService(req.body);
  res.status(201).json(user);
});

export const updateUser = asyncHandler(async (req, res) => {
  await updateUserService(req.params.id, req.body);
  res.status(200).json({ message: "User updated" });
});

export const listUsers = asyncHandler(async (req, res) => {
  const users = await listUsersService();
  res.json(users);
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await getUserService(req.params.id);
  res.json(user);
});

export const deleteUser = asyncHandler(async (req, res) => {
  await deleteUserService(req.params.id);
  res.status(200).json({ message: "User deleted" });
});

export const listActiveUsersWithStatus = asyncHandler(async (req, res) => {
  const users = await listActiveUsersWithStatusService();
  res.json(users);
});