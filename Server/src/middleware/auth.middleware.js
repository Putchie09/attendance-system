import jwt from "jsonwebtoken";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { authenticateByPin } from "../modules/auth/auth.service.js";
import { AppError } from "./AppError.js";

export const authenticateEmployeeByPin = asyncHandler(
  async (req, res, next) => {
    const { username, pin } = req.body;

    const user = await authenticateByPin(username, pin);

    req.user = user;
    next();
  },
);

export const verifyToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new AppError("No token provided", 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    throw new AppError("Invalid or expired token", 401);
  }
});

export const requireAdmin = (req, res, next) => {
  if (req.user?.role_id !== 1) {
    throw new AppError("Admin access required", 403);
  }
  next();
};
