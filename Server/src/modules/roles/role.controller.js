import {
  createRole,
  updateRoleById,
  getRoles,
  getRoleById,
  deleteRoleById,
} from "./role.repository.js";

export const registerRole = async (req, res) => {
  try {
    const { name } = req.body;

    const roleId = await createRole({ name });
    const role = await getRoleById(roleId);

    res.status(201).location(`/roles/${role.id}`).json(role);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    const affectedRows = await updateRoleById({ id, name });
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Role not found" });
    }

    const updatedRole = await getRoleById(id);
    res.json(updatedRole);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const listRoles = async (req, res) => {
  try {
    const roles = await getRoles();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await getRoleById(id);
    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }
    res.json(role);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await deleteRoleById(id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Role not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};