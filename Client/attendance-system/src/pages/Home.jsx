import { useEffect, useState } from "react";
import { Lock, Clock, LogIn, LogOut } from "lucide-react";

function Home() {
  const [time, setTime] = useState(null);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  // Message states
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [attendanceType, setAttendanceType] = useState(null); // "entrada" | "salida"

  const [activeUsers, setActiveUsers] = useState([]);
  const [loading, setLoading] = useState(false); // disable button while loading

  const ID_ENTRADA = 1;


  const fetchServerTime = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/server-time");
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to fetch server time");
      }

      setTime(new Date(data.serverTime));
    } catch (error) {
      console.error("Error fetching server time:", error);
    }
  };

  useEffect(() => {
    fetchServerTime();
  }, []);

  useEffect(() => {
    if (!time) return;

    const interval = setInterval(() => {
      setTime((prev) => new Date(prev.getTime() + 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [time]);

  useEffect(() => {
    const syncInterval = setInterval(() => {
      fetchServerTime();
    }, 60000); // each 60s

    return () => clearInterval(syncInterval);
  }, []);

  const formattedTime = time
    ? time.toLocaleTimeString("es-CR", { hour12: false })
    : "--:--:--";

  const formattedDate = time
    ? time.toLocaleDateString("es-CR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "";

  

  const fetchActiveUsers = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/users/checked-in",
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to fetch active users");
      }

      setActiveUsers(data); // data = [{ name: "yoel" }]
    } catch (error) {
      console.error("Error fetching active users:", error);
    }
  };

  useEffect(() => {
    fetchActiveUsers();
  }, []);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      setMessage("");
      setAttendanceType(null);

      const response = await fetch("http://localhost:5000/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Credenciales inválidas");
      }

      const typeText = data.type_id === ID_ENTRADA ? "entrada" : "salida";

      setAttendanceType(typeText);
      setMessage(`${name}, ${typeText} registrada con éxito`);
      setName("");
      setPassword("");

      await fetchActiveUsers();

      // Clear message after 3 seconds (3000 ms)
      setTimeout(() => {
        setMessage("");
        setAttendanceType(null);
      }, 3000);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gray-100 relative overflow-hidden">
      {/* Admin button */}
      <button className="absolute top-10 right-10 text-gray-500 hover:text-gray-700 transition z-20">
        <Lock size={22} />
      </button>

      {/* CENTER CONTENT */}
      <div className="flex h-full items-center justify-center">
        <div className="text-center w-full max-w-lg px-4">
          <div className="flex items-center justify-center gap-2 text-[rgb(var(--color-primary))] mb-4 tracking-widest text-sm font-medium">
            <Clock size={18} />
            <span>CONTROL DE ASISTENCIA</span>
          </div>

          <h1 className="text-6xl font-bold text-blue-950 tracking-wide">
            {time ? formattedTime : "--:--:--"}
          </h1>

          <p className="text-gray-500 mt-2 capitalize">{formattedDate}</p>

          <div className="mt-10 bg-white shadow-md rounded-xl p-10 text-left">
            <div className="mb-5">
              <label className="block text-sm text-gray-600 mb-1">Nombre</label>
              <input
                type="text"
                placeholder="Ingrese su nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-soft))]"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm text-gray-600 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-soft))]"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary-hover))] cursor-pointer text-white font-semibold py-3 rounded-lg transition glow-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Procesando..." : "Entrada / Salida"}
            </button>
            {errorMessage && (
              <p className="mt-3 text-sm text-red-500 text-center">
                {errorMessage}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ACTIVE USERS*/}
      <div className="absolute right-12 top-1/2 -translate-y-1/2 w-56 text-right">
        <div className="mb-6">
          <h3 className="text-xs font-semibold tracking-widest text-gray-500">
            ACTIVE USERS ({activeUsers.length})
          </h3>
        </div>

        <div className="h-72 overflow-y-scroll custom-scroll pr-2 space-y-4">
          {activeUsers.map((user, index) => (
            <div key={index} className="flex items-center justify-end gap-2">

              <span className="text-sm text-gray-700 font-medium">
                {user.name}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* SUCCESS POPUP */}
      {attendanceType && (
        <div className="fixed top-10 inset-x-0 flex justify-center z-50 pointer-events-none">
          <div className="flex items-center gap-5 bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl px-6 py-5 border border-gray-200 animate-toast min-w-[420px]">
            {/* ICON CONTAINER */}
            <div
              className={`
          flex items-center justify-center
          w-14 h-14 rounded-xl
          ${
            attendanceType === "entrada"
              ? "bg-emerald-500/15"
              : "bg-rose-500/15"
          }
        `}
            >
              {attendanceType === "entrada" ? (
                <LogIn size={26} className="text-emerald-600" />
              ) : (
                <LogOut size={26} className="text-rose-600" />
              )}
            </div>

            {/* TEXT */}
            <div>
              <p
                className={`text-xs uppercase tracking-widest font-medium ${
                  attendanceType === "entrada"
                    ? "text-emerald-600"
                    : "text-rose-600"
                }`}
              >
                {attendanceType === "entrada"
                  ? "Entrada registrada"
                  : "Salida registrada"}
              </p>

              <p className="text-lg font-semibold text-gray-800">{message}</p>
            </div>
          </div>
        </div>
      )}
      {/**/}
    </div>
  );
}

export default Home;