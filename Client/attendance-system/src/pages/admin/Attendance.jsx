import { useState, useEffect, useMemo } from "react";
import {
  Pencil,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  LogIn,
  LogOut,
  Search,
  X,
} from "lucide-react";

const ATTENDANCE_API = "http://localhost:5000/api/attendance";
const PAGE_SIZE = 12;

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
});

// ─── Badge tipo IN / OUT ─────────────────────────────────────────────────────
function TipoBadge({ tipo }) {
  const isIn = tipo === "IN";
  return (
    <span
      className={`inline-flex items-center justify-center gap-1 w-16 py-0.5 rounded-full text-xs font-medium font-poppins ${
        isIn ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
      }`}
    >
      {isIn ? <LogIn size={11} /> : <LogOut size={11} />}
      {tipo}
    </span>
  );
}

// ─── Avatar iniciales ────────────────────────────────────────────────────────
function Avatar({ username }) {
  const initials = username
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

// ─── Skeleton row ─────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <div className="grid grid-cols-12 items-center px-6 py-4 border-b border-gray-100">
      <div className="col-span-1 h-3 w-6 bg-gray-100 rounded-full animate-pulse" />
      <div className="col-span-3 flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gray-100 animate-pulse shrink-0" />
        <div className="h-3 w-24 bg-gray-100 rounded-full animate-pulse" />
      </div>
      <div className="col-span-2 h-5 w-12 bg-gray-100 rounded-full animate-pulse" />
      <div className="col-span-3 h-3 w-20 bg-gray-100 rounded-full animate-pulse" />
      <div className="col-span-2 h-3 w-14 bg-gray-100 rounded-full animate-pulse" />
      <div className="col-span-1 flex justify-end">
        <div className="w-7 h-7 rounded-lg bg-gray-100 animate-pulse" />
      </div>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
function Attendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [searchUser, setSearchUser] = useState("");
  const [filterTipo, setFilterTipo] = useState("ALL");
  const [filterFecha, setFilterFecha] = useState("");

  // Paginación
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await fetch(ATTENDANCE_API, { headers: authHeaders() });
        const data = await res.json();
        setRecords(Array.isArray(data) ? data : []);
      } catch {
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  // Resetear página al cambiar filtros
  useEffect(() => {
    setPage(1);
  }, [searchUser, filterTipo, filterFecha]);

  // Fechas únicas para el select
  const uniqueDates = useMemo(() => {
    const dates = [...new Set(records.map((r) => r.fecha))];
    return dates.sort((a, b) => {
      // Ordenar dd/mm/yyyy desc
      const parse = (d) => d.split("/").reverse().join("");
      return parse(b).localeCompare(parse(a));
    });
  }, [records]);

  // Filtrado
  const filtered = useMemo(() => {
    return records.filter((r) => {
      const matchUser = r.usuario
        .toLowerCase()
        .includes(searchUser.toLowerCase());
      const matchTipo = filterTipo === "ALL" || r.tipo === filterTipo;
      const matchFecha = !filterFecha || r.fecha === filterFecha;
      return matchUser && matchTipo && matchFecha;
    });
  }, [records, searchUser, filterTipo, filterFecha]);

  // Paginación
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const clearFilters = () => {
    setSearchUser("");
    setFilterTipo("ALL");
    setFilterFecha("");
  };

  const hasFilters = searchUser || filterTipo !== "ALL" || filterFecha;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ── Header ── */}
      <div className="shrink-0 mb-2">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="font-poppins text-xl font-bold text-gray-900 mb-0">
              Registros
            </h1>
            <p className="text-xs text-gray-400 font-poppins">
              {records.length}{" "}
              {records.length === 1
                ? "registro encontrado"
                : "registros encontrados"}
            </p>
          </div>

          {/* Chip de filtros activos */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-medium text-gray-500 font-poppins transition cursor-pointer"
            >
              <X size={11} />
              Limpiar filtros
            </button>
          )}
        </div>

        {/* ── Filtros ── */}
        <div className="flex gap-2 flex-wrap shrink-0">
          {/* Buscar usuario */}
          <div className="relative flex-1 min-w-[160px]">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              placeholder="Buscar usuario..."
              className="w-full pl-8 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 font-poppins focus:outline-none focus:ring-2 transition"
              style={{ "--tw-ring-color": "rgb(var(--color-primary-soft))" }}
            />
          </div>

          {/* Filtro tipo */}
          <select
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 font-poppins focus:outline-none focus:ring-2 transition cursor-pointer"
            style={{ "--tw-ring-color": "rgb(var(--color-primary-soft))" }}
          >
            <option value="ALL">Todos los tipos</option>
            <option value="IN">Entrada (IN)</option>
            <option value="OUT">Salida (OUT)</option>
          </select>

          {/* Filtro fecha */}
          <select
            value={filterFecha}
            onChange={(e) => setFilterFecha(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 font-poppins focus:outline-none focus:ring-2 transition cursor-pointer"
            style={{ "--tw-ring-color": "rgb(var(--color-primary-soft))" }}
          >
            <option value="">Todas las fechas</option>
            {uniqueDates.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Tabla con scroll interno ── */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col min-h-0 min-w-0">
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
              <ClipboardList
                size={20}
                style={{ color: "rgb(var(--color-primary))" }}
              />
            </div>
            <p className="text-sm font-medium text-gray-500 font-poppins mb-0.5">
              Sin registros
            </p>
            <p className="text-xs text-gray-400 font-poppins">
              {hasFilters
                ? "No hay registros que coincidan con los filtros"
                : "Aún no hay registros de asistencia"}
            </p>
          </div>
        ) : (
          <>
            {/* Cabecera fija */}
            <div className="shrink-0 grid grid-cols-12 px-6 py-2 border-b border-gray-100 bg-gray-50">
              <span className="col-span-1 text-[11px] font-semibold text-gray-400 font-poppins uppercase tracking-wide">
                ID
              </span>
              <span className="col-span-3 text-[11px] font-semibold text-gray-400 font-poppins uppercase tracking-wide">
                Usuario
              </span>
              <span className="col-span-2 text-[11px] font-semibold text-gray-400 font-poppins uppercase tracking-wide">
                Tipo
              </span>
              <span className="col-span-3 text-[11px] font-semibold text-gray-400 font-poppins uppercase tracking-wide">
                Fecha
              </span>
              <span className="col-span-2 text-[11px] font-semibold text-gray-400 font-poppins uppercase tracking-wide">
                Hora
              </span>
              <span className="col-span-1" />
            </div>

            {/* Filas con scroll */}
            <div className="overflow-y-auto custom-scroll flex-1 divide-y divide-gray-100">
              {paginated.map((record) => (
                <div
                  key={record.id}
                  className="grid grid-cols-12 items-center px-6 py-2.5 hover:bg-gray-50 transition"
                >
                  <div className="col-span-1">
                    <span className="text-sm text-gray-400 font-mono">
                      #{record.id}
                    </span>
                  </div>

                  <div className="col-span-3 flex items-center gap-2">
                    <Avatar username={record.usuario} />
                    <span className="text-sm font-medium text-gray-800 font-poppins truncate">
                      {record.usuario}
                    </span>
                  </div>

                  <div className="col-span-2">
                    <TipoBadge tipo={record.tipo} />
                  </div>

                  <div className="col-span-3">
                    <span className="text-sm text-gray-600 font-poppins">
                      {record.fecha}
                    </span>
                  </div>

                  <div className="col-span-2">
                    <span className="text-sm text-gray-600 font-poppins font-mono">
                      {record.hora}
                    </span>
                  </div>

                  <div className="col-span-1 flex items-center justify-end">
                    <button
                      onClick={() => {}}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition cursor-pointer"
                      title="Editar registro"
                    >
                      <Pencil size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Paginación ── */}
            {totalPages > 1 && (
              <div className="shrink-0 flex items-center justify-between px-6 py-2 border-t border-gray-100 bg-gray-50">
                <p className="text-xs text-gray-400 font-poppins">
                  Mostrando{" "}
                  <span className="text-gray-600 font-medium">
                    {(page - 1) * PAGE_SIZE + 1}–
                    {Math.min(page * PAGE_SIZE, filtered.length)}
                  </span>{" "}
                  de{" "}
                  <span className="text-gray-600 font-medium">
                    {filtered.length}
                  </span>{" "}
                  registros
                </p>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    <ChevronLeft size={15} />
                  </button>

                  {/* Números de página */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (n) =>
                        n === 1 || n === totalPages || Math.abs(n - page) <= 1,
                    )
                    .reduce((acc, n, idx, arr) => {
                      if (idx > 0 && n - arr[idx - 1] > 1) {
                        acc.push("...");
                      }
                      acc.push(n);
                      return acc;
                    }, [])
                    .map((item, idx) =>
                      item === "..." ? (
                        <span
                          key={`ellipsis-${idx}`}
                          className="w-8 h-8 flex items-center justify-center text-xs text-gray-400 font-poppins"
                        >
                          …
                        </span>
                      ) : (
                        <button
                          key={item}
                          onClick={() => setPage(item)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium font-poppins transition cursor-pointer"
                          style={
                            page === item
                              ? {
                                  background: "rgb(var(--color-primary))",
                                  color: "#fff",
                                }
                              : {
                                  color: "rgb(107 114 128)",
                                }
                          }
                        >
                          {item}
                        </button>
                      ),
                    )}

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Attendance;
