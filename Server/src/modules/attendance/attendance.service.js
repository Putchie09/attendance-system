import {
  getTodayAttendance,
  createAttendance,
} from "./attendance.repository.js";
import { AppError } from "../../middleware/AppError.js";

const CLOCK_IN = "IN";
const CLOCK_OUT = "OUT";

export const registerAttendanceService = async (userId) => {
  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }

  const todayRecords = await getTodayAttendance(userId);

  let type;

  if (todayRecords.length === 0) {
    type = CLOCK_IN;
  } else {
    const lastRecord = todayRecords[todayRecords.length - 1];
    type = lastRecord.type === CLOCK_IN ? CLOCK_OUT : CLOCK_IN;
  }

  const attendanceId = await createAttendance(userId, type);

  return {
    id: attendanceId,
    app_user_id: userId,
    type,
  };
};
