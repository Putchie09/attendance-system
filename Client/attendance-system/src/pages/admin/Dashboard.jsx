import { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  ShieldCheck,
  ClipboardList,
  LogIn,
  LogOut,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const USERS_API = "http://localhost:5000/api/users";
const USERS_STATUS_API = "http://localhost:5000/api/users/status";
const ROLES_API = "http://localhost:5000/api/roles";
const ATTENDANCE_API = "http://localhost:5000/api/attendance";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
});

// Fecha de hoy en formato dd/mm/yyyy, igual al que devuelve el backend
const todayFormatted = () => {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

// ─── Card de métrica ──────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, loading, accent }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4 min-w-0">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{
          background: accent
            ? "rgb(var(--color-primary) / 0.1)"
            : "rgb(var(--color-primary) / 0.08)",
        }}
      >
        <Icon size={20} style={{ color: "rgb(var(--color-primary))" }} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-400 font-poppins truncate">{label}</p>
        {loading ? (
          <div className="h-6 w-12 bg-gray-100 rounded-full animate-pulse mt-1" />
        ) : (
          <p className="font-poppins text-2xl font-bold text-gray-900 leading-tight">
            {value}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Badge tipo IN / OUT (igual que en Registros) ─────────────────────────────
function TipoBadge({ tipo }) {
  const isIn = tipo === "IN";
  return (
    <span
      className={`inline-flex items-center justify-center gap-1 w-16 py-0.5 rounded-full text-xs font-medium font-poppins ${
        isIn ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
      }`}
    >
      {isIn ? <LogIn size={11} /> : <LogOut size={11} />}
      {tipo}
    </span>
  );
}

function Avatar({ username }) {
  const initials = (username || "?")
    .replace(/([A-Z])/g, " $1")
    .trim()
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0"
      style={{
        background: "rgb(var(--color-primary) / 0.08)",
        color: "rgb(var(--color-primary))",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {initials}
    </div>
  );
}

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [usersRes, statusRes, rolesRes, attendanceRes] =
          await Promise.all([
            fetch(USERS_API, { headers: authHeaders() }),
            fetch(USERS_STATUS_API, { headers: authHeaders() }),
            fetch(ROLES_API, { headers: authHeaders() }),
            fetch(ATTENDANCE_API, { headers: authHeaders() }),
          ]);
        const [usersData, statusData, rolesData, attendanceData] =
          await Promise.all([
            usersRes.json(),
            statusRes.json(),
            rolesRes.json(),
            attendanceRes.json(),
          ]);
        setUsers(Array.isArray(usersData) ? usersData : []);
        setActiveUsers(Array.isArray(statusData) ? statusData : []);
        setRoles(Array.isArray(rolesData) ? rolesData : []);
        setAttendance(Array.isArray(attendanceData) ? attendanceData : []);
      } catch {
        // silencioso: las cards muestran 0 si algo falla
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
    const iv = setInterval(fetchAll, 15000);
    return () => clearInterval(iv);
  }, []);

  const activeCount = activeUsers.filter((u) => u.is_working).length;
  const today = todayFormatted();
  const todayRecords = attendance.filter((r) => r.fecha === today);
  const recent = attendance.slice(0, 8);

  return (
    <div className="flex flex-col h-full overflow-y-auto custom-scroll">
      {/* Header */}
      <div className="shrink-0 mb-5">
        <h1 className="font-poppins text-xl font-bold text-gray-900 mb-0.5">
          Dashboard
        </h1>
        <p className="text-xs text-gray-400 font-poppins">
          Resumen general del sistema de asistencia
        </p>
      </div>

      {/* Cards */}
      <div className="shrink-0 grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={Users}
          label="Usuarios totales"
          value={users.length}
          loading={loading}
        />
        <StatCard
          icon={UserCheck}
          label="Usuarios activos ahora"
          value={activeCount}
          loading={loading}
          accent
        />
        <StatCard
          icon={ShieldCheck}
          label="Roles"
          value={roles.length}
          loading={loading}
        />
        <StatCard
          icon={ClipboardList}
          label="Registros de hoy"
          value={todayRecords.length}
          loading={loading}
        />
      </div>

      {/* Actividad reciente */}
      <div className="flex-1 min-h-0 bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col">
        <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-poppins text-sm font-semibold text-gray-800">
            Actividad reciente
          </h2>
          <Link
            to="/admin/attendance"
            className="flex items-center gap-1 text-xs font-medium font-poppins transition hover:opacity-80"
            style={{ color: "rgb(var(--color-primary))" }}
          >
            Ver todos
            <ArrowRight size={12} />
          </Link>
        </div>

        {loading ? (
          <div className="divide-y divide-gray-100 overflow-y-auto">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-6 py-3.5">
                <div className="w-7 h-7 rounded-lg bg-gray-100 animate-pulse shrink-0" />
                <div className="h-3 w-32 bg-gray-100 rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
              style={{ background: "rgb(var(--color-primary) / 0.08)" }}
            >
              <ClipboardList
                size={20}
                style={{ color: "rgb(var(--color-primary))" }}
              />
            </div>
            <p className="text-sm font-medium text-gray-500 font-poppins mb-0.5">
              Sin actividad todavía
            </p>
            <p className="text-xs text-gray-400 font-poppins">
              Los registros de entrada y salida aparecerán aquí
            </p>
          </div>
        ) : (
          <div className="overflow-y-auto custom-scroll flex-1 divide-y divide-gray-100">
            {recent.map((record) => (
              <div
                key={record.id}
                className="flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition"
              >
                <Avatar username={record.usuario} />
                <span className="text-sm font-medium text-gray-800 font-poppins truncate flex-1">
                  {record.usuario}
                </span>
                <TipoBadge tipo={record.tipo} />
                <span className="text-xs text-gray-400 font-poppins font-mono w-24 text-right">
                  {record.fecha}
                </span>
                <span className="text-xs text-gray-400 font-poppins font-mono w-12 text-right">
                  {record.hora}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
