export function Toast({ message, type }) {
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
