import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Registros from "./pages/admin/Registros";
import Jornadas from "./pages/admin/Jornadas";
import Usuarios from "./pages/admin/Usuarios";
import Roles from "./pages/admin/Roles";
import Ajustes from "./pages/admin/Ajustes";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/settings/theme");
        const data = await res.json();
        if (data.theme) {
          document.documentElement.setAttribute("data-theme", data.theme);
        }
      } catch (error) {
        console.error("Error loading theme:", error);
      }
    };
    loadTheme();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminLogin />} />

        {/* Rutas protegidas con layout compartido */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="registros" element={<Registros />} />
          <Route path="jornadas" element={<Jornadas />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="roles" element={<Roles />} />
          <Route path="ajustes" element={<Ajustes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
