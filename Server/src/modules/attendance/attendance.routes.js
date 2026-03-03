import { Router } from 'express';
import { registerAttendance } from './attendance.controller.js';
import { authenticateEmployeeByPin } from "../../middleware/auth.middleware.js";

const router = Router();

// frist it goes through authentication, then to the controller
router.post("/", authenticateEmployeeByPin, registerAttendance);

export default router;