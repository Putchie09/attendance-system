import { Router } from 'express';
import { registerAttendance, getAllAttendance, getJornadas, adminCheckout } from './attendance.controller.js';
import { authenticateEmployeeByPin } from "../../middleware/auth.middleware.js";
import { verifyToken, requireAdmin } from "../../middleware/auth.middleware.js";

const router = Router();

// frist it goes through authentication, then to the controller
router.post("/", authenticateEmployeeByPin, registerAttendance);
router.get("/", verifyToken, requireAdmin, getAllAttendance);

// Jornadas: vista de IN/OUT/horas por empleado en una fecha
router.get("/jornadas", verifyToken, requireAdmin, getJornadas);
router.post("/:userId/checkout", verifyToken, requireAdmin, adminCheckout);

export default router;
