import { Router } from 'express';
import { verifyToken, requireAdmin } from "../../middleware/auth.middleware.js";
import {
  registerUser,
  updateUser,
  listUsers,
  getUser,
  deleteUser,
  listActiveUsersWithStatus,
} from "./user.controller.js";

const router = Router();

router.post('/', verifyToken, requireAdmin, registerUser);
router.patch("/:id", verifyToken, requireAdmin, updateUser);

router.get("/status", listActiveUsersWithStatus);

router.get('/:id', getUser);
router.get("/", verifyToken, requireAdmin, listUsers);
router.delete("/:id", verifyToken, requireAdmin, deleteUser);


export default router;
