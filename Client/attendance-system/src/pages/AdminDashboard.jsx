import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/admin");
      return;
    }

    const verify = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          localStorage.removeItem("token");
          navigate("/admin");
        }
      } catch (error) {
        localStorage.removeItem("token");
        navigate("/admin");
      }
    };

    verify();
  }, [navigate]);

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      <div className="flex justify-between items-center p-6 bg-white shadow">
        <h1 className="text-2xl font-bold text-blue-950">Admin Dashboard</h1>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/admin");
          }}
          className="bg-red-500 hover:bg-red-600 cursor-pointer text-white px-4 py-2 rounded-lg transition"
        >
          Cerrar sesión
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <h2 className="text-gray-500 text-lg">Contenido del dashboard</h2>
      </div>
    </div>
  );
}

export default AdminDashboard;
