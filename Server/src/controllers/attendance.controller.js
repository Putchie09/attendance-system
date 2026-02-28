import {
  getTodayAttendance,
  createAttendance,
} from "../models/attendance.model.js";

// comes from the databse
const CLOCK_IN = 1;
const CLOCK_OUT = 2;

export const registerAttendance = async (req, res) => {
  try {
    const user_id = req.user.id; // comes from auth middleware

    const todayRecords = await getTodayAttendance(user_id);

    let type_id;

    if (todayRecords.length === 0) {
      type_id = CLOCK_IN;
    } else {
      const lastRecord = todayRecords[todayRecords.length - 1];

      type_id = lastRecord.type_id === CLOCK_IN ? CLOCK_OUT : CLOCK_IN;
    }

    const ip_address = req.ip;

    const attendanceId = await createAttendance(user_id, type_id, ip_address);

    res.status(201).json({
      id: attendanceId,
      user_id,
      type_id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
