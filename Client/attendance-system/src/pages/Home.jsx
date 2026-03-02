import { useEffect, useState } from "react";
import { Clock, Lock, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

function getInitials(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() || "")
    .join("");
}

// ── PIN Modal ──────────────────────────────────────────────────────────────────
function PinModal({ user, onClose, onSuccess }) {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [closing, setClosing] = useState(false);
  const PIN_LENGTH = 5;

  const triggerClose = () => {
    setClosing(true);
    setTimeout(onClose, 200);
  };

  const isWorking = !!user.is_working;
  const actionLabel = isWorking ? "SALIDA" : "ENTRADA";

  const handleDigit = (d) => {
    if (pin.length >= PIN_LENGTH || loading) return;
    setPin((prev) => prev + d);
    setError("");
  };

  useEffect(() => {
    if (pin.length === PIN_LENGTH) submit(pin);
  }, [pin]);

  const handleDelete = () => {
    if (!loading) setPin((p) => p.slice(0, -1));
  };

  const submit = async (code) => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("http://localhost:5000/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user.username, pin: code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "PIN incorrecto");
      onSuccess(data, user);
    } catch (e) {
      setError(e.message);
      setPin("");
    } finally {
      setLoading(false);
    }
  };

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) triggerClose();
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.key >= "0" && e.key <= "9") handleDigit(e.key);
      if (e.key === "Backspace") handleDelete();
      if (e.key === "Escape") triggerClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [pin, loading]);

  const initials = getInitials(user.username);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: closing ? "rgba(0,0,0,0)" : "rgba(0,0,0,0.55)",
        backdropFilter: "blur(3px)",
        transition: "background 0.2s ease",
      }}
      onClick={handleBackdrop}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl w-[380px] p-8 relative ${closing ? "animate-modal-out" : "animate-modal"}`}
      >
        {/* Close */}
        <button
          onClick={triggerClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X size={22} />
        </button>

        {/* Avatar + name + status */}
        <div className="flex flex-col items-center gap-1.5 mb-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold mb-1"
            style={
              isWorking
                ? {
                    background: "rgb(var(--color-primary) / 0.15)",
                    color: "rgb(var(--color-primary))",
                    outline: "2.5px solid rgb(var(--color-primary))",
                    outlineOffset: "2px",
                  }
                : { background: "#f3f4f6", color: "#6b7280" }
            }
          >
            {initials}
          </div>
          <p className="text-xl font-bold text-gray-900">{user.username}</p>
          <div className="flex items-center gap-1.5 text-sm">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{
                background: isWorking ? "rgb(var(--color-primary))" : "#9ca3af",
              }}
            />
            <span className="text-gray-500">Estado actual:</span>
            <span
              className="font-bold tracking-wide"
              style={{
                color: isWorking ? "rgb(var(--color-primary))" : "#9ca3af",
              }}
            >
              {isWorking ? "TRABAJANDO" : "INACTIVO"}
            </span>
          </div>
        </div>

        {/* Instruction */}
        <p className="text-center text-base text-gray-500 mb-5">
          Ingresa tu PIN para registrar{" "}
          <span className="font-semibold text-gray-700">{actionLabel}</span>
        </p>

        {/* PIN dots */}
        <div className="flex justify-center gap-4 mb-6">
          {Array.from({ length: PIN_LENGTH }).map((_, i) => (
            <div
              key={i}
              className="w-5 h-5 rounded-full border-2 transition-all duration-150"
              style={
                i < pin.length
                  ? {
                      borderColor: "rgb(var(--color-primary))",
                      background: "rgb(var(--color-primary))",
                    }
                  : { borderColor: "#d1d5db", background: "transparent" }
              }
            />
          ))}
        </div>

        {/* Error */}
        {error && (
          <p className="text-center text-sm text-red-500 mb-3 -mt-2">{error}</p>
        )}

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-3">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
            <button
              key={d}
              onClick={() => handleDigit(d)}
              disabled={loading}
              className="h-16 rounded-xl border border-gray-200 text-2xl font-medium text-gray-800 hover:bg-gray-50 active:scale-95 transition disabled:opacity-40"
            >
              {d}
            </button>
          ))}
          <div />
          <button
            onClick={() => handleDigit("0")}
            disabled={loading}
            className="h-16 rounded-xl border border-gray-200 text-2xl font-medium text-gray-800 hover:bg-gray-50 active:scale-95 transition disabled:opacity-40"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            disabled={loading || pin.length === 0}
            className="h-16 rounded-xl text-base text-gray-400 hover:text-gray-600 hover:bg-gray-50 active:scale-95 transition disabled:opacity-30"
          >
            Borrar
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Toast ──────────────────────────────────────────────────────────────────────
function Toast({ message, type }) {
  return (
    <div className="fixed top-8 inset-x-0 flex justify-center z-50 pointer-events-none">
      <div className="flex items-center gap-3 bg-white/90 backdrop-blur-xl shadow-xl rounded-2xl px-6 py-4 border border-gray-200 animate-toast min-w-[340px]">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgb(var(--color-primary) / 0.12)" }}
        >
          {type === "IN" ? (
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              stroke="rgb(var(--color-primary))"
            >
              <path d="M15 3h6v18h-6M10 17l5-5-5-5M15 12H3" />
            </svg>
          ) : (
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              stroke="rgb(var(--color-primary))"
            >
              <path d="M9 21H3V3h6M16 17l5-5-5-5M21 12H9" />
            </svg>
          )}
        </div>
        <div>
          <p
            className="text-xs uppercase tracking-widest font-medium"
            style={{ color: "rgb(var(--color-primary))" }}
          >
            {type === "IN" ? "Entrada registrada" : "Salida registrada"}
          </p>
          <p className="text-base font-semibold text-gray-800">{message}</p>
        </div>
      </div>
    </div>
  );
}

// ── Home ───────────────────────────────────────────────────────────────────────
function Home() {
  const navigate = useNavigate();
  const [time, setTime] = useState(null);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchServerTime = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/server-time");
      const data = await res.json();
      setTime(new Date(data.serverTime));
    } catch {
      setTime(new Date());
    }
  };

  useEffect(() => {
    fetchServerTime();
  }, []);
  useEffect(() => {
    if (!time) return;
    const iv = setInterval(
      () => setTime((p) => new Date(p.getTime() + 1000)),
      1000,
    );
    return () => clearInterval(iv);
  }, [time]);
  useEffect(() => {
    const iv = setInterval(fetchServerTime, 60000);
    return () => clearInterval(iv);
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users/status");
      const data = await res.json();
      setUsers(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  useEffect(() => {
    const iv = setInterval(fetchUsers, 15000);
    return () => clearInterval(iv);
  }, []);

  const formattedTime = time
    ? time.toLocaleTimeString("es-CR", { hour12: false })
    : "--:--:--";

  const formattedDate = time
    ? time.toLocaleDateString("es-CR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
      })
    : "";

  const activeCount = users.filter((u) => u.is_working).length;
  const filtered = users.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSuccess = (data, user) => {
    const typeLabel = data.type === "IN" ? "entrada" : "salida";
    setToast({
      message: `${user.username}, ${typeLabel} registrada con éxito`,
      type: data.type,
    });
    // Show toast first, then smoothly close modal after a short delay
    setTimeout(() => {
      setSelectedUser(null);
      fetchUsers();
    }, 350);
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* TOP NAV */}
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
            <p className="text-sm text-gray-400 capitalize">{formattedDate}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900 tabular-nums leading-tight">
              {formattedTime}
            </p>
            <div className="flex items-center justify-end gap-1.5">
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: "rgb(var(--color-primary))" }}
              />
              <p className="text-sm text-gray-500">
                {activeCount} empleados activos
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/admin")}
            className="w-11 h-11 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition"
            title="Panel de administrador"
          >
            <Lock size={19} className="text-gray-500" />
          </button>
        </div>
      </header>

      {/* SEARCH */}
      <div className="flex justify-center pt-9 pb-3 px-4">
        <div className="relative w-full max-w-lg">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-200 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none shadow-sm"
          />
        </div>
      </div>

      {/* GRID */}
      <main className="flex-1 px-8 py-7">
        {filtered.length === 0 && search.trim() !== "" && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9ca3af"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </div>
            <p className="text-gray-800 font-semibold text-base">
              No se encontraron resultados
            </p>
            <p className="text-gray-400 text-sm mt-1">
              No hay empleados con el nombre{" "}
              <span className="font-medium text-gray-500">"{search}"</span>
            </p>
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 max-w-6xl mx-auto">
          {filtered.map((user, index) => {
            const isWorking = !!user.is_working;
            const initials = getInitials(user.username);

            return (
              <button
                key={index}
                onClick={() => setSelectedUser(user)}
                className="bg-white rounded-xl px-5 py-6 flex flex-col items-center gap-2.5 border transition cursor-pointer w-full hover:shadow-md"
                style={
                  isWorking
                    ? {
                        borderColor: "rgb(var(--color-primary) / 0.35)",
                        background: "rgb(var(--color-primary) / 0.04)",
                      }
                    : { borderColor: "#f3f4f6" }
                }
              >
                <div className="relative">
                  <div
                    className="w-[68px] h-[68px] rounded-full flex items-center justify-center text-lg font-semibold"
                    style={
                      isWorking
                        ? {
                            background: "rgb(var(--color-primary) / 0.15)",
                            color: "rgb(var(--color-primary))",
                            outline: "2px solid rgb(var(--color-primary))",
                            outlineOffset: "2px",
                          }
                        : { background: "#f3f4f6", color: "#6b7280" }
                    }
                  >
                    {initials}
                  </div>
                  {isWorking && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white flex items-center justify-center">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: "rgb(var(--color-primary))" }}
                      >
                        <svg
                          width="9"
                          height="9"
                          viewBox="0 0 12 12"
                          fill="none"
                        >
                          <path
                            d="M2 6l3 3 5-5"
                            stroke="white"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-base font-semibold leading-snug text-gray-700">
                    {user.username}
                  </p>
                  <p
                    className="text-sm mt-0.5"
                    style={{
                      color: isWorking
                        ? "rgb(var(--color-primary))"
                        : "#9ca3af",
                    }}
                  >
                    {user.role}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </main>

      {/* PIN MODAL */}
      {selectedUser && (
        <PinModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onSuccess={handleSuccess}
        />
      )}

      {/* TOAST */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}

export default Home;
