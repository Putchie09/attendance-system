// src/pages/admin/Ajustes.jsx
import { useState, useEffect } from "react";
import { Check } from "lucide-react";

const THEMES = [
  { id: "purple", label: "Morado", color: "139 92 246" },
  { id: "blue", label: "Azul", color: "14 165 233" },
  { id: "green", label: "Verde", color: "16 185 129" },
  { id: "orange", label: "Naranja", color: "249 115 22" },
  { id: "rose", label: "Rosa", color: "244 63 94" },
];

function Ajustes() {
  const [currentTheme, setCurrentTheme] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null); // { type: "success"|"error", msg }

  // Carga el tema actual al montar
  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/settings/theme");
        const data = await res.json();
        setCurrentTheme(data.theme);
        setSelected(data.theme);
      } catch {
        showToast("error", "No se pudo cargar el tema actual");
      } finally {
        setLoading(false);
      }
    };
    fetchTheme();
  }, []);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    if (!selected || selected === currentTheme) return;

    setSaving(true);
    try {
      const res = await fetch("http://localhost:5000/api/settings/theme", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify({ theme: selected }),
      });

      if (!res.ok) throw new Error();

      // Aplica el tema en la UI inmediatamente
      document.documentElement.setAttribute("data-theme", selected);
      setCurrentTheme(selected);
      showToast("success", "Tema guardado correctamente");
    } catch {
      showToast("error", "Error al guardar el tema");
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = selected !== currentTheme;

  return (
    <div className="max-w-xl h-full overflow-y-auto custom-scroll">
      {/* Título */}
      <div className="mb-8">
        <h1 className="font-poppins text-2xl font-bold text-gray-900 mb-1">
          Ajustes
        </h1>
        <p className="text-sm text-gray-400 font-poppins">
          Personalizá la apariencia del sistema
        </p>
      </div>

      {/* Card de tema */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-poppins text-sm font-semibold text-gray-700 mb-1">
          Color del sistema
        </h2>
        <p className="text-xs text-gray-400 font-poppins mb-5">
          Se aplica en toda la interfaz, incluyendo la pantalla de empleados
        </p>

        {loading ? (
          <div className="flex gap-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full bg-gray-100 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setSelected(theme.id)}
                title={theme.label}
                className="relative w-10 h-10 rounded-full transition-transform hover:scale-110 cursor-pointer focus:outline-none"
                style={{ background: `rgb(${theme.color})` }}
              >
                {selected === theme.id && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <Check size={16} color="white" strokeWidth={3} />
                  </span>
                )}
                {/* Anillo cuando está seleccionado */}
                {selected === theme.id && (
                  <span
                    className="absolute -inset-1 rounded-full border-2"
                    style={{ borderColor: `rgb(${theme.color})` }}
                  />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Label del tema seleccionado */}
        {selected && !loading && (
          <p className="text-xs text-gray-400 font-poppins mt-4">
            Seleccionado:{" "}
            <span className="font-semibold text-gray-600">
              {THEMES.find((t) => t.id === selected)?.label}
            </span>
            {currentTheme === selected && (
              <span className="ml-2 text-gray-300">(actual)</span>
            )}
          </p>
        )}

        {/* Botón guardar */}
        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold font-poppins transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            style={{ background: "rgb(var(--color-primary))" }}
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>

          {hasChanges && !saving && (
            <button
              onClick={() => setSelected(currentTheme)}
              className="text-sm text-gray-400 hover:text-gray-600 font-poppins transition cursor-pointer"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`animate-toast fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-poppins font-medium shadow-lg ${
            toast.type === "success"
              ? "bg-green-50 text-green-700 border border-green-100"
              : "bg-red-50 text-red-600 border border-red-100"
          }`}
        >
          {toast.type === "success" ? <Check size={15} /> : "⚠"}
          {toast.msg}
        </div>
      )}
    </div>
  );
}

export default Ajustes;
