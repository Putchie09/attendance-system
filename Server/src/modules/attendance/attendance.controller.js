import {
  getTodayAttendance,
  createAttendance,
} from "./attendance.repository.js";

// comes from the databse
const CLOCK_IN = "IN";
const CLOCK_OUT = "OUT";

export const registerAttendance = async (req, res) => {
  try {
    const app_user_id = req.user.id; // from auth middleware

    const todayRecords = await getTodayAttendance(app_user_id);

    let type;

    if (todayRecords.length === 0) {
      type = CLOCK_IN;
    } else {
      const lastRecord = todayRecords[todayRecords.length - 1];
      type = lastRecord.type === CLOCK_IN ? CLOCK_OUT : CLOCK_IN;
    }

    const attendanceId = await createAttendance(app_user_id, type);

    res.status(201).json({
      id: attendanceId,
      app_user_id,
      type,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};