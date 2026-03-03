import { Router } from "express";
import { registerRole, updateRole, listRoles, getRole, deleteRole } from "./role.controller.js";

const router = Router();

router.post("/", registerRole);
router.patch("/:id", updateRole);
router.get("/:id", getRole);
router.get("/", listRoles);
router.delete("/:id", deleteRole);

export default router;