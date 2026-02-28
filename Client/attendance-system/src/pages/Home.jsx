import { useEffect, useState } from "react";
import { Lock, Clock } from "lucide-react";

function Home() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formattedTime = time.toLocaleTimeString("es-CR", {
    hour12: false,
  });

  const formattedDate = time.toLocaleDateString("es-CR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const activeUsers = [
    "YoelPutchie",
    "YordinHerrera",
    "MariaGomez",
    "CarlosVargas",
    "AnaSolis",
    "DavidRamirez",
    "LauraJimenez",
    "EstebanRojas",
    "ValeriaChaves",
    "AndresMora",
  ];

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
            {formattedTime}
          </h1>

          <p className="text-gray-500 mt-2 capitalize">{formattedDate}</p>

          <div className="mt-10 bg-white shadow-md rounded-xl p-10 text-left">
            <div className="mb-5">
              <label className="block text-sm text-gray-600 mb-1">Nombre</label>
              <input
                type="text"
                placeholder="Ingrese su nombre"
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
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-soft))]"
              />
            </div>

            <button className="w-full bg-[rgb(var(--color-primary))] hover:bg-[rgb(var(--color-primary-hover))] text-white font-semibold py-3 rounded-lg transition glow-primary">
              Entrada / Salida
            </button>
          </div>
        </div>
      </div>

      {/* ACTIVE USERS RIGHT SIDE */}
      <div className="absolute right-12 top-1/2 -translate-y-1/2 w-56 text-right">
        <div className="mb-6">
          <h3 className="text-xs font-semibold tracking-widest text-gray-500">
            ACTIVE USERS
          </h3>
          <p className="text-xs text-gray-400">{activeUsers.length} online</p>
        </div>

        <div className="h-72 overflow-y-scroll custom-scroll pr-2 space-y-4">
          {activeUsers.map((user) => (
            <div key={user} className="flex items-center justify-end gap-2">
              <div className="w-2 h-2 rounded-full bg-[rgb(var(--color-primary))]" />
              <span className="text-sm text-gray-700 font-medium">{user}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
