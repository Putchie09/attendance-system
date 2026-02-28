import { Router } from 'express';
import { registerAttendance } from '../controllers/attendance.controller.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';

const router = Router();

// frist it goes through authentication, then to the controller
router.post('/', authenticateUser, registerAttendance);

export default router;