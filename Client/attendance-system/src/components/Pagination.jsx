import { ChevronLeft, ChevronRight } from "lucide-react";

// ─── Paginación reutilizable para tablas del panel admin ─────────────────────
// Uso: <Pagination page={page} totalPages={totalPages} totalItems={n} pageSize={PAGE_SIZE} onPageChange={setPage} />
export function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  itemLabel = "resultados",
}) {
  if (totalPages <= 1) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
    .reduce((acc, n, idx, arr) => {
      if (idx > 0 && n - arr[idx - 1] > 1) acc.push("...");
      acc.push(n);
      return acc;
    }, []);

  return (
    <div className="shrink-0 flex items-center justify-between px-6 py-2 border-t border-gray-100 bg-gray-50">
      <p className="text-xs text-gray-400 font-poppins">
        Mostrando{" "}
        <span className="text-gray-600 font-medium">
          {from}–{to}
        </span>{" "}
        de <span className="text-gray-600 font-medium">{totalItems}</span>{" "}
        {itemLabel}
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
        >
          <ChevronLeft size={15} />
        </button>

        {pages.map((item, idx) =>
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
              onClick={() => onPageChange(item)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium font-poppins transition cursor-pointer"
              style={
                page === item
                  ? { background: "rgb(var(--color-primary))", color: "#fff" }
                  : { color: "rgb(107 114 128)" }
              }
            >
              {item}
            </button>
          ),
        )}

        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
