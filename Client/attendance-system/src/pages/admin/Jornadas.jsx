import { useState, useEffect, useMemo } from "react";
import {
  CalendarClock,
  Search,
  LogOut,
  Check,
  Clock,
} from "lucide-react";
import { Pagination } from "../../components/Pagination";
import { PAGE_SIZE } from "../../constants/ui";

const JORNADAS_API = "http://localhost:5000/api/attendance/jornadas";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
});

// yyyy-mm-dd de hoy, en hora local (para el <input type="date">)
const todayIso = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

function Avatar({ username }) {
  const initials = (username || "?")
    .replace(/([A-Z])/g, " $1")
    .trim()
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0"
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

function SkeletonRow() {
  return (
    <div className="grid grid-cols-12 items-center px-6 py-3 border-b border-gray-100">
      <div className="col-span-3 flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gray-100 animate-pulse shrink-0" />
        <div className="h-3 w-24 bg-gray-100 rounded-full animate-pulse" />
      </div>
      <div className="col-span-2 h-3 w-16 bg-gray-100 rounded-full animate-pulse" />
      <div className="col-span-2 h-3 w-12 bg-gray-100 rounded-full animate-pulse" />
      <div className="col-span-2 h-3 w-12 bg-gray-100 rounded-full animate-pulse" />
      <div className="col-span-2 h-3 w-14 bg-gray-100 rounded-full animate-pulse" />
      <div className="col-span-1 flex justify-end">
        <div className="w-8 h-8 rounded-lg bg-gray-100 animate-pulse" />
      </div>
    </div>
  );
}

function Jornadas() {
  const [date, setDate] = useState(todayIso());
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [checkingOut, setCheckingOut] = useState(null); // app_user_id en proceso
  const [toast, setToast] = useState(null);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchJornadas = async () => {
    try {
      const res = await fetch(`${JORNADAS_API}?date=${date}`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      setRows(Array.isArray(data) ? data : []);
    } catch {
      showToast("error", "No se pudieron cargar las jornadas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchJornadas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  useEffect(() => {
    setPage(1);
  }, [search, date]);

  const handleCheckout = async (app_user_id) => {
    setCheckingOut(app_user_id);
    try {
      const res = await fetch(
        `http://localhost:5000/api/attendance/${app_user_id}/checkout`,
        { method: "POST", headers: authHeaders() },
      );
      if (!res.ok) {
        const data = await res.json();
        showToast("error", data.error || "No se pudo marcar la salida");
        return;
      }
      await fetchJornadas();
      showToast("success", "Salida marcada correctamente");
    } catch {
      showToast("error", "No se pudo conectar con el servidor");
    } finally {
      setCheckingOut(null);
    }
  };

  const filtered = useMemo(
    () =>
      rows.filter((r) =>
        r.username.toLowerCase().includes(search.toLowerCase()),
      ),
    [rows, search],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const isToday = date === todayIso();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header + filtros — fijos */}
      <div className="shrink-0 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-poppins text-xl font-bold text-gray-900 mb-0.5">
              Jornadas
            </h1>
            <p className="text-xs text-gray-400 font-poppins">
              {rows.length}{" "}
              {rows.length === 1 ? "empleado" : "empleados"} · IN, OUT y horas
              trabajadas
            </p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {/* Buscar usuario */}
          <div className="relative flex-1 min-w-[160px]">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar empleado..."
              className="w-full pl-8 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 font-poppins focus:outline-none focus:ring-2 transition"
              style={{ "--tw-ring-color": "rgb(var(--color-primary-soft))" }}
            />
          </div>

          {/* Selector de fecha */}
          <input
            type="date"
            value={date}
            max={todayIso()}
            onChange={(e) => setDate(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 font-poppins focus:outline-none focus:ring-2 transition cursor-pointer"
            style={{ "--tw-ring-color": "rgb(var(--color-primary-soft))" }}
          />

          {!isToday && (
            <button
              onClick={() => setDate(todayIso())}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-500 font-poppins transition cursor-pointer"
            >
              <Clock size={13} />
              Hoy
            </button>
          )}
        </div>
      </div>

      {/* Tabla con scroll interno */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col min-h-0">
        {loading ? (
          <div className="divide-y divide-gray-100 overflow-y-auto">
            {[...Array(6)].map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
              style={{ background: "rgb(var(--color-primary) / 0.08)" }}
            >
              <CalendarClock
                size={20}
                style={{ color: "rgb(var(--color-primary))" }}
              />
            </div>
            <p className="text-sm font-medium text-gray-500 font-poppins mb-0.5">
              {search ? "Sin resultados" : "Sin empleados"}
            </p>
            <p className="text-xs text-gray-400 font-poppins">
              {search
                ? `No hay empleados que coincidan con "${search}"`
                : "No hay empleados activos registrados"}
            </p>
          </div>
        ) : (
          <>
            {/* Cabecera fija */}
            <div className="shrink-0 grid grid-cols-12 px-6 py-3 border-b border-gray-100 bg-gray-50">
              <span className="col-span-3 text-[11px] font-semibold text-gray-400 font-poppins uppercase tracking-wide">
                Empleado
              </span>
              <span className="col-span-2 text-[11px] font-semibold text-gray-400 font-poppins uppercase tracking-wide">
                Fecha
              </span>
              <span className="col-span-2 text-[11px] font-semibold text-gray-400 font-poppins uppercase tracking-wide">
                Entrada
              </span>
              <span className="col-span-2 text-[11px] font-semibold text-gray-400 font-poppins uppercase tracking-wide">
                Salida
              </span>
              <span className="col-span-2 text-[11px] font-semibold text-gray-400 font-poppins uppercase tracking-wide">
                Horas
              </span>
              <span className="col-span-1" />
            </div>

            {/* Filas con scroll */}
            <div className="overflow-y-auto custom-scroll flex-1 divide-y divide-gray-100">
              {paginated.map((r) => (
                <div
                  key={r.app_user_id}
                  className="grid grid-cols-12 items-center px-6 py-3 hover:bg-gray-50 transition"
                >
                  <div className="col-span-3 flex items-center gap-2.5">
                    <Avatar username={r.username} />
                    <span className="text-sm font-medium text-gray-800 font-poppins truncate">
                      {r.username}
                    </span>
                  </div>

                  <div className="col-span-2">
                    <span className="text-sm text-gray-600 font-poppins">
                      {r.fecha}
                    </span>
                  </div>

                  <div className="col-span-2">
                    <span className="text-sm text-gray-700 font-poppins font-mono">
                      {r.hora_in ?? "-"}
                    </span>
                  </div>

                  <div className="col-span-2">
                    <span className="text-sm text-gray-700 font-poppins font-mono">
                      {r.hora_out ?? "-"}
                    </span>
                  </div>

                  <div className="col-span-2">
                    <span
                      className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium font-poppins"
                      style={
                        r.horas !== "-"
                          ? {
                              background: "rgb(var(--color-primary) / 0.08)",
                              color: "rgb(var(--color-primary))",
                            }
                          : { background: "rgb(243 244 246)", color: "rgb(156 163 175)" }
                      }
                    >
                      {r.horas}
                    </span>
                  </div>

                  <div className="col-span-1 flex items-center justify-end">
                    {r.can_checkout ? (
                      <button
                        onClick={() => handleCheckout(r.app_user_id)}
                        disabled={checkingOut === r.app_user_id}
                        title="Marcar salida"
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <LogOut size={14} />
                      </button>
                    ) : r.hora_out ? (
                      <span
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-green-500"
                        title="Jornada completa"
                      >
                        <Check size={14} />
                      </span>
                    ) : (
                      <span className="w-8 h-8" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              totalItems={filtered.length}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
              itemLabel={filtered.length === 1 ? "empleado" : "empleados"}
            />
          </>
        )}
      </div>

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

export default Jornadas;
