import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Credenciales incorrectas");
        }

        if (response.status === 403) {
          throw new Error("No tienes permisos de administrador");
        }

        throw new Error("Error inesperado");
      }
      // save token
      localStorage.setItem("token", data.token);
      // redirect to dashboard
      navigate("/admin/dashboard");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gray-100 relative overflow-hidden">
      <div className="flex h-full items-center justify-center">
        <div className="text-center w-full max-w-lg px-4">
          <div className="flex items-center justify-center gap-2 text-[rgb(var(--color-primary))] mb-4 tracking-widest text-sm font-medium">
            <Lock size={18} />
            <span>ADMIN PANEL</span>
          </div>

          <h1 className="text-4xl font-bold text-blue-950 tracking-wide">
            Acceso Administrador
          </h1>

          <p className="text-gray-500 mt-2 mb-10">
            Ingrese sus credenciales para continuar
          </p>

          <div className="bg-white shadow-md rounded-xl p-10 text-left">
            <div className="mb-5">
              <label className="block text-sm text-gray-600 mb-1">Nombre</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingrese su nombre"
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-soft))]"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm text-gray-600 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingrese su contraseña"
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-soft))]"
              />
            </div>

            {errorMessage && (
              <p className="text-sm text-red-500 text-center mb-4">
                {errorMessage}
              </p>
            )}

            <div className="flex flex-col gap-4">
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary-hover))] cursor-pointer text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
              >
                {loading ? "Procesando..." : "Iniciar sesión"}
              </button>

              <button
                onClick={() => navigate("/")}
                className="w-full bg-gray-200 hover:bg-gray-300 cursor-pointer text-gray-700 font-semibold py-3 rounded-lg transition"
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
