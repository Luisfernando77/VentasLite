import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  NavLink,
} from "react-router-dom";
import "./App.css";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import Login from "./pages/Login";
import api from "./services/api";
import Sales from "./pages/Sales";
import Reports from "./pages/Reports";
import Assistant from "./pages/Assistant";

function Dashboard() {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);
  const [ventasMensuales, setVentasMensuales] = useState([]);
  const [productosTop, setProductosTop] = useState([]);

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
      .then((response) => {
        setDatos(response.data.resumen);
      })
      .catch(() => {
        setError("No se pudieron cargar los indicadores.");
      })
      .finally(() => {
        setCargando(false);
      });

    Promise.all([
      api.get("/admin/reports/monthly-sales", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      api.get("/admin/reports/top-products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    ])
      .then(([ventas, productos]) => {
        setVentasMensuales(ventas.data.ventas_mensuales);
        setProductosTop(productos.data.top_productos);
      })
      .catch((error) => {
        console.error("Error al cargar las gráficas:", error);
      });
  }, [navigate]);

  const cerrarSesion = async () => {
    try {
      await api.post(
        "/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  const formatoMoneda = (valor) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 2,
    }).format(Number(valor || 0));

  const formatoNumero = (valor) =>
    new Intl.NumberFormat("es-MX").format(Number(valor || 0));

  return (
    <div className="dashboard-layout">

      {/* MENÚ LATERAL */}
      <aside className="sidebar">

        <div className="sidebar-logo">
          <div className="logo-icon">V</div>
          <h2>VentasLite</h2>
        </div>

        <p className="sidebar-section">MENÚ PRINCIPAL</p>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className="nav-link">
            <span>▦</span> Dashboard
          </NavLink>

          <NavLink to="/sales" className="nav-link">
            <span>▤</span> Ventas
          </NavLink>

          <NavLink to="/reports" className="nav-link">
            <span>▥</span> Reportes
          </NavLink>

          <NavLink to="/assistant" className="nav-link">
            <span>✧</span> Asistente IA
          </NavLink>
        </nav>

        <div className="sidebar-bottom">
          <div className="user-avatar">
            {(usuario.name || "A").charAt(0).toUpperCase()}
          </div>

          <div className="user-info">
            <strong>{usuario.name || "Administrador"}</strong>
            <span>{usuario.role || "Usuario"}</span>
          </div>

          <button
            className="logout-button"
            onClick={cerrarSesion}
            title="Cerrar sesión"
          >
            ⇥
          </button>
        </div>

      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="dashboard-main">

        <header className="topbar">
          <div>
            <h1>Dashboard</h1>
            <p>Resumen general de tu negocio</p>
          </div>

          <div className="topbar-user">
            <span>Bienvenido, {usuario.name || "Administrador"}</span>
          </div>
        </header>

        <section className="welcome-section">
          <div>
            <h2>¡Hola, {usuario.name || "Administrador"}!</h2>
            <p>Este es el resumen de actividad de VentasLite.</p>
          </div>

          <div className="welcome-date">
            PANEL DE ADMINISTRACIÓN
          </div>
        </section>

        {cargando && (
          <div className="dashboard-message">
            Cargando indicadores...
          </div>
        )}

        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        {datos && (
          <>
            <section className="metrics-grid">

              <article className="metric-card">
                <div className="metric-top">
                  <span className="metric-icon blue">▤</span>
                  <span className="metric-label">VENTAS TOTALES</span>
                </div>

                <h3>{formatoNumero(datos.total_ventas)}</h3>
                <p>Operaciones registradas</p>
              </article>

              <article className="metric-card">
                <div className="metric-top">
                  <span className="metric-icon green">$</span>
                  <span className="metric-label">INGRESOS</span>
                </div>

                <h3>{formatoMoneda(datos.ingresos)}</h3>
                <p>Ingresos acumulados</p>
              </article>

              <article className="metric-card">
                <div className="metric-top">
                  <span className="metric-icon purple">◈</span>
                  <span className="metric-label">TICKET PROMEDIO</span>
                </div>

                <h3>{formatoMoneda(datos.ticket_promedio)}</h3>
                <p>Promedio por venta</p>
              </article>

              <article className="metric-card">
                <div className="metric-top">
                  <span className="metric-icon orange">▣</span>
                  <span className="metric-label">UNIDADES VENDIDAS</span>
                </div>

                <h3>{formatoNumero(datos.unidades_vendidas)}</h3>
                <p>Productos vendidos</p>
              </article>

            </section>


            <section className="charts-grid">

              <article className="chart-card">
                <h3>Ventas mensuales</h3>
                <p>Evolución de ingresos por mes</p>

                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={ventasMensuales}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="periodo" />
                      <YAxis />
                      <Tooltip
                        formatter={(value) =>
                          formatoMoneda(value)
                        }
                      />
                      <Line
                        type="monotone"
                        dataKey="ingresos"
                        stroke="#2563eb"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </article>

              <article className="chart-card">
                <h3>Productos más vendidos</h3>
                <p>Ranking por unidades vendidas</p>

                <div className="chart-container">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={productosTop}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        interval={0}
                        angle={-25}
                        textAnchor="end"
                        height={75}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="unidades_vendidas"
                        fill="#10b981"
                        radius={[5, 5, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </article>

            </section>
            <section className="dashboard-bottom">

              <article className="summary-card">
                <h3>Resumen del negocio</h3>
                <p>
                  Indicadores generales obtenidos directamente
                  de la base de datos.
                </p>

                <div className="summary-row">
                  <span>Total de ventas</span>
                  <strong>{formatoNumero(datos.total_ventas)}</strong>
                </div>

                <div className="summary-row">
                  <span>Ingresos acumulados</span>
                  <strong>{formatoMoneda(datos.ingresos)}</strong>
                </div>

                <div className="summary-row">
                  <span>Ticket promedio</span>
                  <strong>{formatoMoneda(datos.ticket_promedio)}</strong>
                </div>

                <div className="summary-row">
                  <span>Unidades vendidas</span>
                  <strong>{formatoNumero(datos.unidades_vendidas)}</strong>
                </div>
              </article>

              <article className="quick-access-card">
                <h3>Accesos rápidos</h3>
                <p>Administra las principales funciones del sistema.</p>

                <NavLink to="/sales" className="quick-link">
                  <span>▤</span>
                  <div>
                    <strong>Consultar ventas</strong>
                    <small>Revisar operaciones registradas</small>
                  </div>
                  <b>›</b>
                </NavLink>

                <NavLink to="/reports" className="quick-link">
                  <span>▥</span>
                  <div>
                    <strong>Ver reportes</strong>
                    <small>Consultar estadísticas del negocio</small>
                  </div>
                  <b>›</b>
                </NavLink>

                <NavLink to="/assistant" className="quick-link">
                  <span>✧</span>
                  <div>
                    <strong>Asistente IA</strong>
                    <small>Consultar información del negocio</small>
                  </div>
                  <b>›</b>
                </NavLink>

              </article>

            </section>
          </>
        )}

        <footer className="dashboard-footer">
          VentasLite © 2026 | Sistema de administración de ventas
        </footer>

      </main>
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
        <Route path="/sales" element={<Sales />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;