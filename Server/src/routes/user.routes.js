import { Router } from 'express';
import { registerUser, updateUser } from "../controllers/user.controller.js";

const router = Router();

router.post('/', registerUser);
router.patch('/:id', updateUser);

export default router;
