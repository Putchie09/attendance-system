import { Outlet } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";

function AdminLayout() {
  const user = JSON.parse(localStorage.getItem("admin_user") || "{}");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-30">
          <h1 className="font-poppins text-base font-bold text-gray-900">
            Hola, {user.username}
          </h1>
        </header>

        {/* Aquí se renderiza la página activa */}
        <main className="flex-1 px-8 py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
