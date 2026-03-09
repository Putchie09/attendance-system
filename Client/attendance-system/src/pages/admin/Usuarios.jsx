import { useState, useEffect } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  X,
  Check,
  User,
  AlertTriangle,
  RefreshCw,
  Eye,
  EyeOff,
} from "lucide-react";

const API = "http://localhost:5000/api/users";
const ROLES_API = "http://localhost:5000/api/roles";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
});

const generatePin = () => String(Math.floor(10000 + Math.random() * 90000));

// ─── Modal crear / editar ────────────────────────────────────────────────────
function UserModal({ user, roles, onClose, onSaved }) {
  const isEdit = !!user;

  const [form, setForm] = useState({
    username: user?.username ?? "",
    password: "",
    pin: generatePin(),
    role_id: user?.role_id ?? "",
    is_active: user?.is_active ?? 1,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPin, setShowPin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setError("");
  };

  // Detecta si el rol seleccionado es admin (role_id === 1 o name === "Admin")
  const selectedRole = roles.find((r) => String(r.id) === String(form.role_id));
  const isAdminRole = selectedRole?.name?.toLowerCase() === "admin";

  const handleSubmit = async () => {
    if (!form.username.trim()) {
      setError("El nombre de usuario es requerido");
      return;
    }
    if (!form.role_id) {
      setError("Seleccioná un rol");
      return;
    }
    if (!isEdit && !form.pin) {
      setError("El PIN es requerido");
      return;
    }

    const body = {};
    if (isEdit) {
      if (form.username) body.username = form.username.trim();
      if (form.pin) body.pin = form.pin;
      if (form.role_id) body.role_id = Number(form.role_id);
      body.is_active = form.is_active;
      if (isAdminRole && form.password) body.password = form.password;
    } else {
      body.username = form.username.trim();
      body.pin = form.pin;
      body.role_id = Number(form.role_id);
      if (isAdminRole && form.password) body.password = form.password;
    }

    setLoading(true);
    try {
      const res = await fetch(isEdit ? `${API}/${user.id}` : API, {
        method: isEdit ? "PATCH" : "POST",
        headers: authHeaders(),
        body: JSON.stringify(body),
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
      <div className="animate-modal bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <h2 className="font-poppins text-sm font-semibold text-gray-800">
            {isEdit ? "Editar usuario" : "Nuevo usuario"}
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">
          {/* Username */}
          <div>
            <label className="block text-xs font-medium text-gray-500 font-poppins mb-1.5">
              Nombre de usuario
            </label>
            <input
              type="text"
              value={form.username}
              autoFocus
              onChange={(e) => set("username", e.target.value)}
              placeholder="Ej: juan.perez"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 font-poppins focus:outline-none focus:ring-2 focus:bg-white transition"
              style={{ "--tw-ring-color": "rgb(var(--color-primary-soft))" }}
            />
          </div>

          {/* Rol */}
          <div>
            <label className="block text-xs font-medium text-gray-500 font-poppins mb-1.5">
              Rol
            </label>
            <select
              value={form.role_id}
              onChange={(e) => set("role_id", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 font-poppins focus:outline-none focus:ring-2 focus:bg-white transition cursor-pointer"
              style={{ "--tw-ring-color": "rgb(var(--color-primary-soft))" }}
            >
              <option value="">Seleccionar rol...</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* PIN */}
          <div>
            <label className="block text-xs font-medium text-gray-500 font-poppins mb-1.5">
              PIN{" "}
              {isEdit && (
                <span className="text-gray-400">
                  (dejá vacío para no cambiar)
                </span>
              )}
            </label>
            <div className="relative">
              <input
                type={showPin ? "text" : "password"}
                value={form.pin}
                onChange={(e) =>
                  set("pin", e.target.value.replace(/\D/g, "").slice(0, 5))
                }
                placeholder="5 dígitos"
                className="w-full px-4 py-2.5 pr-20 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 font-poppins focus:outline-none focus:ring-2 focus:bg-white transition"
                style={{ "--tw-ring-color": "rgb(var(--color-primary-soft))" }}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => set("pin", generatePin())}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                  title="Generar PIN aleatorio"
                >
                  <RefreshCw size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => setShowPin((v) => !v)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition cursor-pointer"
                >
                  {showPin ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
              </div>
            </div>
          </div>

          {/* Contraseña — solo si es rol admin */}
          {isAdminRole && (
            <div>
              <label className="block text-xs font-medium text-gray-500 font-poppins mb-1.5">
                Contraseña{" "}
                {isEdit && (
                  <span className="text-gray-400">
                    (dejá vacío para no cambiar)
                  </span>
                )}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  placeholder={
                    isEdit ? "Nueva contraseña..." : "Contraseña del admin"
                  }
                  className="w-full px-4 py-2.5 pr-10 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 font-poppins focus:outline-none focus:ring-2 focus:bg-white transition"
                  style={{
                    "--tw-ring-color": "rgb(var(--color-primary-soft))",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition cursor-pointer"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          )}

          {/* Activo (solo en edición) */}
          {isEdit && (
            <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-gray-50 border border-gray-200">
              <span className="text-sm font-medium text-gray-700 font-poppins">
                Usuario activo
              </span>
              {/* Toggle corregido */}
              <button
                type="button"
                onClick={() => set("is_active", form.is_active ? 0 : 1)}
                className="relative inline-flex items-center cursor-pointer"
                style={{ width: 44, height: 24 }}
              >
                <span
                  className="absolute inset-0 rounded-full transition-colors duration-200"
                  style={{
                    backgroundColor: form.is_active
                      ? "rgb(74 222 128)"
                      : "rgb(209 213 219)",
                  }}
                />
                <span
                  className="absolute w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
                  style={{
                    top: 2,
                    left: 2,
                    transform: form.is_active
                      ? "translateX(20px)"
                      : "translateX(0px)",
                  }}
                />
              </button>
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="text-xs text-red-500 font-poppins flex items-center gap-1">
              <AlertTriangle size={11} /> {error}
            </p>
          )}

          {/* Acciones */}
          <div className="flex gap-2 pt-1">
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
                  : "Crear usuario"}
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
function ConfirmModal({ user, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await fetch(`${API}/${user.id}`, {
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
          ¿Eliminar "{user.username}"?
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

// ─── Avatar con iniciales ────────────────────────────────────────────────────
function Avatar({ username }) {
  const initials = username
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
      style={{
        background: "rgb(var(--color-primary) / 0.08)",
        color: "rgb(var(--color-primary))",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {initials}
    </div>
  );
}

// ─── Página principal ────────────────────────────────────────────────────────
function Usuarios() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState(null);
  const [delUser, setDelUser] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      const [usersRes, rolesRes] = await Promise.all([
        fetch(API, { headers: authHeaders() }),
        fetch(ROLES_API, { headers: authHeaders() }),
      ]);
      const [usersData, rolesData] = await Promise.all([
        usersRes.json(),
        rolesRes.json(),
      ]);
      setUsers(usersData);
      setRoles(rolesData);
    } catch {
      showToast("error", "No se pudieron cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaved = (msg) => {
    setEditUser(null);
    setShowCreate(false);
    fetchData();
    showToast("success", msg);
  };

  const handleDeleted = () => {
    setDelUser(null);
    fetchData();
    showToast("success", "Usuario eliminado");
  };

  const getRoleName = (role_id) =>
    roles.find((r) => r.id === role_id)?.name ?? "—";

  const filtered = users.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    // Contenedor que ocupa exactamente el alto disponible sin overflow externo
    <div className="flex flex-col h-[calc(100vh-73px)]">
      {/* Header + buscador — fijos */}
      <div className="shrink-0 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-poppins text-2xl font-bold text-gray-900 mb-0.5">
              Usuarios
            </h1>
            <p className="text-xs text-gray-400 font-poppins">
              {users.length}{" "}
              {users.length === 1
                ? "usuario registrado"
                : "usuarios registrados"}
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-white text-sm font-medium font-poppins transition hover:opacity-90 cursor-pointer"
            style={{ background: "rgb(var(--color-primary))" }}
          >
            <Plus size={15} />
            Nuevo usuario
          </button>
        </div>

        {/* Buscador */}
        <div className="relative">
          <User
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 font-poppins focus:outline-none focus:ring-2 transition"
            style={{ "--tw-ring-color": "rgb(var(--color-primary-soft))" }}
          />
        </div>
      </div>

      {/* Tabla con scroll interno */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col min-h-0">
        {loading ? (
          <div className="divide-y divide-gray-100 overflow-y-auto">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4">
                <div className="w-8 h-8 rounded-lg bg-gray-100 animate-pulse" />
                <div className="flex flex-col gap-1.5">
                  <div className="h-3.5 w-28 bg-gray-100 rounded-full animate-pulse" />
                  <div className="h-3 w-16 bg-gray-100 rounded-full animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
              style={{ background: "rgb(var(--color-primary) / 0.08)" }}
            >
              <User size={20} style={{ color: "rgb(var(--color-primary))" }} />
            </div>
            <p className="text-sm font-medium text-gray-500 font-poppins mb-0.5">
              {search ? "Sin resultados" : "Sin usuarios"}
            </p>
            <p className="text-xs text-gray-400 font-poppins">
              {search
                ? `No hay usuarios que coincidan con "${search}"`
                : "Creá el primer usuario con el botón de arriba"}
            </p>
          </div>
        ) : (
          <>
            {/* Cabecera fija */}
            <div className="shrink-0 grid grid-cols-12 px-6 py-3 border-b border-gray-100 bg-gray-50">
              <span className="col-span-1 text-[11px] font-semibold text-gray-400 font-poppins uppercase tracking-wide">
                ID
              </span>
              <span className="col-span-4 text-[11px] font-semibold text-gray-400 font-poppins uppercase tracking-wide">
                Usuario
              </span>
              <span className="col-span-3 text-[11px] font-semibold text-gray-400 font-poppins uppercase tracking-wide">
                Rol
              </span>
              <span className="col-span-2 text-[11px] font-semibold text-gray-400 font-poppins uppercase tracking-wide">
                Estado
              </span>
              <span className="col-span-2" />
            </div>

            {/* Filas con scroll */}
            <div className="overflow-y-auto custom-scroll flex-1 divide-y divide-gray-100">
              {filtered.map((user) => (
                <div
                  key={user.id}
                  className="grid grid-cols-12 items-center px-6 py-4 hover:bg-gray-50 transition"
                >
                  <div className="col-span-1">
                    <span className="text-sm text-gray-400 font-mono">
                      #{user.id}
                    </span>
                  </div>

                  <div className="col-span-4 flex items-center gap-2.5">
                    <Avatar username={user.username} />
                    <span className="text-sm font-medium text-gray-800 font-poppins truncate">
                      {user.username}
                    </span>
                  </div>

                  <div className="col-span-3">
                    <span
                      className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium font-poppins"
                      style={{
                        background: "rgb(var(--color-primary) / 0.08)",
                        color: "rgb(var(--color-primary))",
                      }}
                    >
                      {getRoleName(user.role_id)}
                    </span>
                  </div>

                  <div className="col-span-2">
                    {user.is_active ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-poppins bg-green-50 text-green-600">
                        Activo
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-poppins bg-gray-100 text-gray-400">
                        Inactivo
                      </span>
                    )}
                  </div>

                  <div className="col-span-2 flex items-center justify-end gap-1">
                    <button
                      onClick={() => setEditUser(user)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition cursor-pointer"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDelUser(user)}
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
        <UserModal
          roles={roles}
          onClose={() => setShowCreate(false)}
          onSaved={() => handleSaved("Usuario creado correctamente")}
        />
      )}
      {editUser && (
        <UserModal
          user={editUser}
          roles={roles}
          onClose={() => setEditUser(null)}
          onSaved={() => handleSaved("Usuario actualizado")}
        />
      )}
      {delUser && (
        <ConfirmModal
          user={delUser}
          onClose={() => setDelUser(null)}
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

export default Usuarios;
