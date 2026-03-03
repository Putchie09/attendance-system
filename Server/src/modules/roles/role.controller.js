import { asyncHandler } from "../../middleware/asyncHandler.js";
import {
  createRoleService,
  updateRoleService,
  listRolesService,
  getRoleService,
  deleteRoleService,
} from "./role.service.js";

export const registerRole = asyncHandler(async (req, res) => {
  const role = await createRoleService(req.body.name);
  res.status(201).json(role);
});

export const updateRole = asyncHandler(async (req, res) => {
  const role = await updateRoleService(req.params.id, req.body.name);
  res.json(role);
});

export const listRoles = asyncHandler(async (req, res) => {
  const roles = await listRolesService();
  res.json(roles);
});

export const getRole = asyncHandler(async (req, res) => {
  const role = await getRoleService(req.params.id);
  res.json(role);
});

export const deleteRole = asyncHandler(async (req, res) => {
  await deleteRoleService(req.params.id);
  res.status(204).send();
});
