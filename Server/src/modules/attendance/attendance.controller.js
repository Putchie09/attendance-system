import { asyncHandler } from "../../middleware/asyncHandler.js";
import { registerAttendanceService } from "./attendance.service.js";

export const registerAttendance = asyncHandler(async (req, res) => {
  const result = await registerAttendanceService(req.user.id);
  res.status(201).json(result);
});
