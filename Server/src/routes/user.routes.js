import { Router } from 'express';
import {
  registerUser,
  updateUser,
  listUsers,
  getUser,
  deleteUser,
  listUsersCurrentlyCheckedIn,
} from "../controllers/user.controller.js";

const router = Router();

router.post('/', registerUser);
router.patch('/:id', updateUser);
router.get("/checked-in", listUsersCurrentlyCheckedIn);
router.get('/:id', getUser);
router.get('/', listUsers);
router.delete('/:id', deleteUser);



export default router;
