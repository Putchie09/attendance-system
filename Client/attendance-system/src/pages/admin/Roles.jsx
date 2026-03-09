// src/pages/admin/Roles.jsx
import { useState, useEffect } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  X,
  Check,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

const API = "http://localhost:5000/api/roles";
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
});

// ─── Modal crear / editar ────────────────────────────────────────────────────
function RoleModal({ role, onClose, onSaved }) {
  const isEdit = !!role;
  const [name, setName] = useState(role?.name ?? "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("El nombre es requerido");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(isEdit ? `${API}/${role.id}` : API, {
        method: isEdit ? "PATCH" : "POST",
        headers: authHeaders(),
        body: JSON.stringify({ name: name.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Error al guardar");
        return;
      }
      onSaved();
    } catch {
      setError("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-[2px]">
      <div className="animate-modal bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 border border-gray-100">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <h2 className="font-poppins text-sm font-semibold text-gray-800">
            {isEdit ? "Editar rol" : "Nuevo rol"}
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>

        <div className="px-6 py-5">
          <label className="block text-xs font-medium text-gray-500 font-poppins mb-1.5">
            Nombre del rol
          </label>
          <input
            type="text"
            value={name}
            autoFocus
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Ej: Supervisor"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 font-poppins focus:outline-none focus:ring-2 focus:bg-white transition"
            style={{ "--tw-ring-color": "rgb(var(--color-primary-soft))" }}
          />
          {error && (
            <p className="text-xs text-red-500 font-poppins mt-2 flex items-center gap-1">
              <AlertTriangle size={11} /> {error}
            </p>
          )}
          <div className="flex gap-2 mt-5">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold font-poppins transition disabled:opacity-50 cursor-pointer"
              style={{ background: "rgb(var(--color-primary))" }}
            >
              {loading
                ? "Guardando..."
                : isEdit
                  ? "Guardar cambios"
                  : "Crear rol"}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-600 font-poppins transition cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Modal confirmar eliminación ─────────────────────────────────────────────
function ConfirmModal({ role, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await fetch(`${API}/${role.id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      onDeleted();
    } catch {
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-[2px]">
      <div className="animate-modal bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 border border-gray-100 p-6">
        <h2 className="font-poppins text-sm font-semibold text-gray-800 mb-1">
          ¿Eliminar "{role.name}"?
        </h2>
        <p className="text-xs text-gray-400 font-poppins mb-5 leading-relaxed">
          Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold font-poppins transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-600 font-poppins transition cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Página principal ────────────────────────────────────────────────────────
function Roles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editRole, setEditRole] = useState(null);
  const [delRole, setDelRole] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchRoles = async () => {
    try {
      const res = await fetch(API, { headers: authHeaders() });
      const data = await res.json();
      setRoles(data);
    } catch {
      showToast("error", "No se pudieron cargar los roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaved = (msg) => {
    setEditRole(null);
    setShowCreate(false);
    fetchRoles();
    showToast("success", msg);
  };

  const handleDeleted = () => {
    setDelRole(null);
    fetchRoles();
    showToast("success", "Rol eliminado");
  };

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-poppins text-2xl font-bold text-gray-900 mb-0.5">
            Roles
          </h1>
          <p className="text-xs text-gray-400 font-poppins">
            {roles.length}{" "}
            {roles.length === 1 ? "rol registrado" : "roles registrados"}
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-white text-sm font-medium font-poppins transition hover:opacity-90 cursor-pointer"
          style={{ background: "rgb(var(--color-primary))" }}
        >
          <Plus size={15} />
          Nuevo rol
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="divide-y divide-gray-100">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-5">
                <div className="w-8 h-8 rounded-xl bg-gray-100 animate-pulse" />
                <div className="h-4 w-32 bg-gray-100 rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        ) : roles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
              style={{ background: "rgb(var(--color-primary) / 0.08)" }}
            >
              <ShieldCheck
                size={20}
                style={{ color: "rgb(var(--color-primary))" }}
              />
            </div>
            <p className="text-sm font-medium text-gray-500 font-poppins mb-0.5">
              Sin roles
            </p>
            <p className="text-xs text-gray-400 font-poppins">
              Creá el primer rol con el botón de arriba
            </p>
          </div>
        ) : (
          <>
            {/* Cabecera */}
            <div className="grid grid-cols-12 px-6 py-3 border-b border-gray-100 bg-gray-50">
              <span className="col-span-2 text-[11px] font-semibold text-gray-400 font-poppins uppercase tracking-wide">
                ID
              </span>
              <span className="col-span-7 text-[11px] font-semibold text-gray-400 font-poppins uppercase tracking-wide">
                Nombre
              </span>
              <span className="col-span-3" />
            </div>

            {/* Filas */}
            <div className="divide-y divide-gray-100">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className="grid grid-cols-12 items-center px-6 py-4 hover:bg-gray-50 transition"
                >
                  <div className="col-span-2">
                    <span className="text-sm text-gray-400 font-mono">
                      #{role.id}
                    </span>
                  </div>

                  <div className="col-span-7 flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: "rgb(var(--color-primary) / 0.08)" }}
                    >
                      <ShieldCheck
                        size={15}
                        style={{ color: "rgb(var(--color-primary))" }}
                      />
                    </div>
                    <span className="text-base font-medium text-gray-800 font-poppins">
                      {role.name}
                    </span>
                  </div>

                  <div className="col-span-3 flex items-center justify-end gap-1">
                    <button
                      onClick={() => setEditRole(role)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition cursor-pointer"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDelRole(role)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modales */}
      {showCreate && (
        <RoleModal
          onClose={() => setShowCreate(false)}
          onSaved={() => handleSaved("Rol creado correctamente")}
        />
      )}
      {editRole && (
        <RoleModal
          role={editRole}
          onClose={() => setEditRole(null)}
          onSaved={() => handleSaved("Rol actualizado")}
        />
      )}
      {delRole && (
        <ConfirmModal
          role={delRole}
          onClose={() => setDelRole(null)}
          onDeleted={handleDeleted}
        />
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`animate-toast fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-poppins font-medium shadow-lg border ${
            toast.type === "success"
              ? "bg-white text-gray-700 border-gray-200"
              : "bg-red-50 text-red-600 border-red-100"
          }`}
        >
          {toast.type === "success" ? (
            <Check size={14} style={{ color: "rgb(var(--color-primary))" }} />
          ) : (
            "⚠"
          )}
          {toast.msg}
        </div>
      )}
    </div>
  );
}

export default Roles;
