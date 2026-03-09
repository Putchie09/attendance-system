import { Router } from "express";
import { registerRole, updateRole, listRoles, getRole, deleteRole } from "./role.controller.js";
import { verifyToken, requireAdmin } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/", verifyToken, requireAdmin, listRoles);
router.get("/:id", verifyToken, requireAdmin, getRole);
router.post("/", verifyToken, requireAdmin, registerRole);
router.patch("/:id", verifyToken, requireAdmin, updateRole);
router.delete("/:id", verifyToken, requireAdmin, deleteRole);

export default router;