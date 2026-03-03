import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdminLogin";

function App() {
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/settings/theme");
        const data = await res.json();

        if (data.theme) {
          document.documentElement.setAttribute("data-theme", data.theme);
        }
      } catch (error) {
        console.error("Error loading theme:", error);
      }
    };

    loadTheme();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
