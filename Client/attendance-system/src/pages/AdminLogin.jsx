import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, ArrowLeft, Eye, EyeOff } from "lucide-react";

function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = () => {
    // TODO: implement auth
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* NAVBAR */}
      <header className="bg-white border-b border-gray-200 px-10 py-5 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: "rgb(var(--color-primary) / 0.12)" }}
          >
            <Clock size={22} style={{ color: "rgb(var(--color-primary))" }} />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900 leading-tight">
              TimeKeep
            </p>
            <p className="text-sm text-gray-400">Panel de administrador</p>
          </div>
        </div>

        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition group"
        >
          <ArrowLeft
            size={16}
            className="transition-transform group-hover:-translate-x-0.5"
          />
          Volver
        </button>
      </header>

      {/* FORM */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="mb-8 text-center">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: "rgb(var(--color-primary) / 0.1)" }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                stroke="rgb(var(--color-primary))"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Acceso restringido
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Ingresá tus credenciales de administrador
            </p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            {/* Username */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Usuario
              </label>
              <input
                type="text"
                placeholder="Nombre de usuario"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setErrorMessage("");
                }}
                onKeyDown={handleKeyDown}
                autoComplete="username"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white transition"
                style={{ "--tw-ring-color": "rgb(var(--color-primary-soft))" }}
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage("");
                  }}
                  onKeyDown={handleKeyDown}
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:bg-white transition"
                  style={{
                    "--tw-ring-color": "rgb(var(--color-primary-soft))",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {errorMessage && (
              <div className="flex items-center gap-2 mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-100">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="flex-shrink-0"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="text-sm text-red-600">{errorMessage}</p>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3 rounded-xl text-white text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "rgb(var(--color-primary))" }}
              onMouseEnter={(e) => {
                if (!loading)
                  e.currentTarget.style.background =
                    "rgb(var(--color-primary-hover))";
              }}
              onMouseLeave={(e) => {
                if (!loading)
                  e.currentTarget.style.background =
                    "rgb(var(--color-primary))";
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                  >
                    <path
                      d="M21 12a9 9 0 1 1-6.219-8.56"
                      strokeLinecap="round"
                    />
                  </svg>
                  Verificando...
                </span>
              ) : (
                "Iniciar sesión"
              )}
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-5">
            Solo administradores tienen acceso a este panel.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
