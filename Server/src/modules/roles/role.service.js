import {
  createRole,
  updateRoleById,
  getRoles,
  getRoleById,
  deleteRoleById,
} from "./role.repository.js";
import { AppError } from "../../middleware/AppError.js";

export const createRoleService = async (name) => {
  if (!name) {
    throw new AppError("Name is required", 400);
  }

  const roleId = await createRole({ name });
  return await getRoleById(roleId);
};

export const updateRoleService = async (id, name) => {
  if (!name) {
    throw new AppError("Name is required", 400);
  }

  const affectedRows = await updateRoleById({ id, name });

  if (affectedRows === 0) {
    throw new AppError("Role not found", 404);
  }

  return await getRoleById(id);
};

export const getRoleService = async (id) => {
  const role = await getRoleById(id);
  if (!role) {
    throw new AppError("Role not found", 404);
  }
  return role;
};

export const listRolesService = async () => {
  return await getRoles();
};

export const deleteRoleService = async (id) => {
  const affectedRows = await deleteRoleById(id);
  if (affectedRows === 0) {
    throw new AppError("Role not found", 404);
  }
};
