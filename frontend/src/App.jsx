import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import api from "./services/api";
import Sales from "./pages/Sales";
import Reports from "./pages/Reports";
import Assistant from "./pages/Assistant";

function Dashboard() {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const usuario = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    api.get("/admin/reports/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => setDatos(response.data))
      .catch(() => setError("No se pudieron cargar los reportes."));
  }, [navigate]);

  const cerrarSesion = async () => {
    try {
      await api.post("/logout", {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>VentasLite</h1>
        <button onClick={cerrarSesion}>Cerrar sesión</button>
      </header>

      <h2>Dashboard</h2>
      <p>Bienvenido, {usuario.name}</p>
      <p>Rol: {usuario.role}</p>

      {error && <p>{error}</p>}

      {!datos && !error && <p>Cargando reportes...</p>}

      {datos && (
        <pre style={{
          background: "#f1f5f9",
          padding: "20px",
          borderRadius: "8px",
          overflowX: "auto"
        }}>
          {JSON.stringify(datos, null, 2)}
        </pre>
      )}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/assistant" element={<Assistant />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/sales" element={<Sales />} />  <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;