import { useEffect, useState } from "react";
import { X } from "lucide-react";

function getInitials(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() || "")
    .join("");
}

const PIN_LENGTH = 5;

export function PinModal({ user, onClose, onSuccess }) {
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [closing, setClosing] = useState(false);

  const isWorking = !!user.is_working;
  const actionLabel = isWorking ? "SALIDA" : "ENTRADA";
  const initials = getInitials(user.username);

  const triggerClose = () => {
    setClosing(true);
    setTimeout(onClose, 200);
  };

  const handleDigit = (d) => {
    if (pin.length >= PIN_LENGTH || loading) return;
    setPin((prev) => prev + d);
    setError("");
  };

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

  // Auto-submit when PIN is complete
  useEffect(() => {
    if (pin.length === PIN_LENGTH) submit(pin);
  }, [pin]);

  // Keyboard support
  useEffect(() => {
    const handler = (e) => {
      if (e.key >= "0" && e.key <= "9") handleDigit(e.key);
      if (e.key === "Backspace") handleDelete();
      if (e.key === "Escape") triggerClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [pin, loading]);

  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) triggerClose();
  };

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
        className={`bg-white rounded-2xl shadow-2xl w-[380px] p-8 relative ${
          closing ? "animate-modal-out" : "animate-modal"
        }`}
      >
        {/* Close button */}
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

        {/* Error message */}
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
