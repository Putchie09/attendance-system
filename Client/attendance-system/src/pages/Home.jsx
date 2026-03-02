import { useState } from "react";
import { Clock, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useServerTime } from "../hooks/useServerTime";
import { useUsers } from "../hooks/useUsers";
import { UserCard } from "../components/UserCard";
import { PinModal } from "../components/PinModal";
import { Toast } from "../components/Toast";

function Home() {
  const navigate = useNavigate();
  const { formattedTime, formattedDate } = useServerTime();
  const { users, fetchUsers } = useUsers();

  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [toast, setToast] = useState(null);

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
        {/* Empty state */}
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
          {filtered.map((user) => (
            <UserCard
              key={user.username}
              user={user}
              onClick={setSelectedUser}
            />
          ))}
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
