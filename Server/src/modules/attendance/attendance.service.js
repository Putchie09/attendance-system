import {
  getTodayAttendance,
  createAttendance,
  getAttendanceByDate,
} from "./attendance.repository.js";
import { AppError } from "../../middleware/AppError.js";
import { getAllAttendance } from "./attendance.repository.js";
import { getUsers } from "../users/user.repository.js";

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

export const getAllAttendanceService = async () => {
  return await getAllAttendance();
};

// ─── Jornadas ─────────────────────────────────────────────────────────────

const pad = (n) => String(n).padStart(2, "0");

// yyyy-mm-dd (para comparar en SQL / usar como valor por defecto)
const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

// dd/mm/yyyy (para mostrar)
const isoToDisplay = (isoDate) => {
  const [y, m, d] = isoDate.split("-");
  return `${d}/${m}/${y}`;
};

const formatTime = (date) => {
  const d = new Date(date);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const calcHoras = (inDate, outDate) => {
  const diffMs = new Date(outDate) - new Date(inDate);
  if (diffMs < 0) return "-";
  const totalMinutes = Math.round(diffMs / 60000);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}h ${pad(m)}m`;
};

// Devuelve una fila por cada empleado activo con su IN/OUT/horas de una fecha dada.
export const getJornadasService = async (dateParam) => {
  const dateIso = dateParam || todayIso();

  const [users, records] = await Promise.all([
    getUsers(),
    getAttendanceByDate(dateIso),
  ]);

  const activeUsers = users.filter((u) => u.is_active);

  const byUser = {};
  for (const r of records) {
    if (!byUser[r.app_user_id]) byUser[r.app_user_id] = [];
    byUser[r.app_user_id].push(r);
  }

  return (
    activeUsers
      .map((u) => {
        const userRecords = byUser[u.id] || [];
        const inRecord = userRecords.find((r) => r.type === CLOCK_IN);
        const outRecords = userRecords.filter((r) => r.type === CLOCK_OUT);
        const outRecord = outRecords[outRecords.length - 1] ?? null;

        return {
          app_user_id: u.id,
          username: u.username,
          fecha: isoToDisplay(dateIso),
          hora_in: inRecord ? formatTime(inRecord.recorded_at) : null,
          hora_out: outRecord ? formatTime(outRecord.recorded_at) : null,
          horas:
            inRecord && outRecord
              ? calcHoras(inRecord.recorded_at, outRecord.recorded_at)
              : "-",
          is_today: dateIso === todayIso(),
          can_checkout: dateIso === todayIso() && !!inRecord && !outRecord,
          _hasIn: !!inRecord,
        };
      })
      // Solo empleados que marcaron entrada ese día (con o sin salida)
      .filter((row) => row._hasIn)
      .map(({ _hasIn, ...row }) => row)
  );
};

// El admin marca la salida (OUT) de un empleado por él, usando la hora actual.
export const adminCheckoutService = async (app_user_id) => {
  if (!app_user_id) {
    throw new AppError("Falta el usuario", 400);
  }

  const todayRecords = await getTodayAttendance(app_user_id);

  if (todayRecords.length === 0) {
    throw new AppError("El usuario no tiene entrada registrada hoy", 400);
  }

  const lastRecord = todayRecords[todayRecords.length - 1];
  if (lastRecord.type === CLOCK_OUT) {
    throw new AppError("El usuario ya tiene una salida registrada", 400);
  }

  const attendanceId = await createAttendance(app_user_id, CLOCK_OUT);

  return { id: attendanceId, app_user_id: Number(app_user_id), type: CLOCK_OUT };
};
