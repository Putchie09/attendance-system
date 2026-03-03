import { useEffect, useState } from "react";

// gets current server time and keeps it updated every second, with periodic re-syncs
export function useServerTime() {
  const [time, setTime] = useState(null);

  const fetchServerTime = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/time");
      const data = await res.json();
      setTime(new Date(data.serverTime));
    } catch {
      setTime(new Date());
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchServerTime();
  }, []);

  // Tick every second
  useEffect(() => {
    if (!time) return;
    const iv = setInterval(
      () => setTime((p) => new Date(p.getTime() + 1000)),
      1000,
    );
    return () => clearInterval(iv);
  }, [time]);

  // Re-sync with server every 60s
  useEffect(() => {
    const iv = setInterval(fetchServerTime, 60000);
    return () => clearInterval(iv);
  }, []);

  const formattedTime = time
    ? time.toLocaleTimeString("es-CR", { hour12: false })
    : "--:--:--";

  const formattedDate = time
    ? time.toLocaleDateString("es-CR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
      })
    : "";

  return { formattedTime, formattedDate };
}
