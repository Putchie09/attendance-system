import { Outlet } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";

function AdminLayout() {
  const user = JSON.parse(localStorage.getItem("admin_user") || "{}");

  return (
    // h-screen + overflow-hidden: el layout nunca excede el viewport.
    // Cada página controla su propio scroll interno (normalmente solo en la tabla).
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0 h-screen">
        {/* Topbar */}
        <header className="shrink-0 bg-white border-b border-gray-200 px-8 py-4 z-30">
          <h1 className="font-poppins text-base font-bold text-gray-900">
            Hola, {user.username}
          </h1>
        </header>

        {/* Aquí se renderiza la página activa, acotada al espacio restante */}
        <main className="flex-1 min-h-0 px-8 py-6 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
