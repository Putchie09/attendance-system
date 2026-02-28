import { Router } from 'express';
import { registerUser, updateUser, listUsers, getUser } from "../controllers/user.controller.js";

const router = Router();

router.post('/', registerUser);
router.patch('/:id', updateUser);
router.get('/:id', getUser);
router.get('/', listUsers);

export default router;
