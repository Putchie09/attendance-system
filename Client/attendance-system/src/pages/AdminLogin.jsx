import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

function AdminLogin() {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-gray-100 relative overflow-hidden">
      <div className="flex h-full items-center justify-center">
        <div className="text-center w-full max-w-lg px-4">
          {/* Header */}
          <div className="flex items-center justify-center gap-2 text-[rgb(var(--color-primary))] mb-4 tracking-widest text-sm font-medium">
            <Lock size={18} />
            <span>ADMIN PANEL</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-blue-950 tracking-wide">
            Acceso Administrador
          </h1>

          <p className="text-gray-500 mt-2 mb-10">
            Ingrese sus credenciales para continuar
          </p>

          {/* Card */}
          <div className="bg-white shadow-md rounded-xl p-10 text-left">
            <div className="mb-5">
              <label className="block text-sm text-gray-600 mb-1">Nombre</label>
              <input
                type="text"
                placeholder="Ingrese su nombre"
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-soft))]"
              />
            </div>

            <div className="mb-8">
              <label className="block text-sm text-gray-600 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                placeholder="Ingrese su contraseña"
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-soft))]"
              />
            </div>

            {/* Buttons column */}
            <div className="flex flex-col gap-4">
              <button className="w-full bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary-hover))] cursor-pointer text-white font-semibold py-3 rounded-lg transition">
                Iniciar sesión
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
