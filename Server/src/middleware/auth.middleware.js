import { asyncHandler } from "../middleware/asyncHandler.js";
import { authenticateByPin } from "../modules/auth/auth.service.js";

export const authenticateEmployeeByPin = asyncHandler(
  async (req, res, next) => {
    const { username, pin } = req.body;

    const user = await authenticateByPin(username, pin);

    req.user = user;
    next();
  },
);
