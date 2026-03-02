import { useEffect, useState } from "react";

export function useUsers() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users/status");
      const data = await res.json();
      setUsers(data);
    } catch (e) {
      console.error("Failed to fetch users:", e);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchUsers();
  }, []);

  // Poll every 15s
  useEffect(() => {
    const iv = setInterval(fetchUsers, 15000);
    return () => clearInterval(iv);
  }, []);

  return { users, fetchUsers };
}
