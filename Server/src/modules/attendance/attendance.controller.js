import { asyncHandler } from "../../middleware/asyncHandler.js";
import {
  registerAttendanceService,
  getAllAttendanceService,
  getJornadasService,
  adminCheckoutService,
} from "./attendance.service.js";

export const registerAttendance = asyncHandler(async (req, res) => {
  const result = await registerAttendanceService(req.user.id);
  res.status(201).json(result);
});

export const getAllAttendance = asyncHandler(async (req, res) => {
  const result = await getAllAttendanceService();
  res.json(result);
});

export const getJornadas = asyncHandler(async (req, res) => {
  const result = await getJornadasService(req.query.date);
  res.json(result);
});

export const adminCheckout = asyncHandler(async (req, res) => {
  const result = await adminCheckoutService(req.params.userId);
  res.status(201).json(result);
});
