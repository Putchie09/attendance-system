import { NavLink, useNavigate } from "react-router-dom";
import {
  Clock,
  LayoutDashboard,
  ClipboardList,
  CalendarClock,
  Users,
  ShieldCheck,
  Settings,
  LogOut,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/admin/dashboard" },
  { label: "Registros", icon: ClipboardList, to: "/admin/registros" },
  { label: "Jornadas", icon: CalendarClock, to: "/admin/jornadas" },
  { label: "Usuarios", icon: Users, to: "/admin/usuarios" },
  { label: "Roles", icon: ShieldCheck, to: "/admin/roles" },
  { label: "Ajustes", icon: Settings, to: "/admin/ajustes" },
];

// Formatea: "Domingo, 08 De Marzo"
const getFormattedDate = () => {
  return new Date()
    .toLocaleDateString("es-ES", {
      weekday: "long",
      day: "2-digit",
      month: "long",
    })
    .replace(/(\w)(\w*)/g, (_, first, rest) => first.toUpperCase() + rest);
};

function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    navigate("/");
  };

  return (
    <aside className="font-poppins w-[220px] min-h-screen bg-white border-r border-gray-100 flex flex-col px-4 py-7 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-1 mb-8">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "rgb(var(--color-primary) / 0.12)" }}
        >
          <Clock size={18} style={{ color: "rgb(var(--color-primary))" }} />
        </div>
        <div>
          <p className="text-base font-bold text-gray-900 leading-tight">
            TimeKeep
          </p>
          <p className="text-[11px] text-gray-400 leading-tight">
            {getFormattedDate()}
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map(({ label, icon: Icon, to }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 text-sm font-semibold transition cursor-pointer"
      >
        <LogOut size={17} />
        Cerrar sesión
      </button>
    </aside>
  );
}

export default AdminSidebar;
