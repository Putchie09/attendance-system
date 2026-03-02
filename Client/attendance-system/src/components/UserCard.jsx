function getInitials(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() || "")
    .join("");
}

export function UserCard({ user, onClick }) {
  const isWorking = !!user.is_working;
  const initials = getInitials(user.username);

  return (
    <button
      onClick={() => onClick(user)}
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
      {/* Avatar */}
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

        {/* Working badge */}
        {isWorking && (
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white flex items-center justify-center">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: "rgb(var(--color-primary))" }}
            >
              <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
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

      {/* Name + role */}
      <div className="text-center">
        <p className="text-base font-semibold leading-snug text-gray-700">
          {user.username}
        </p>
        <p
          className="text-sm mt-0.5"
          style={{ color: isWorking ? "rgb(var(--color-primary))" : "#9ca3af" }}
        >
          {user.role}
        </p>
      </div>
    </button>
  );
}
