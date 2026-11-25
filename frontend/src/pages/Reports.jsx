import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";
import api from "../services/api";
import "../App.css";

function Reports() {
    const [reporte, setReporte] = useState("mensual");
    const [datos, setDatos] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const endpoints = {
        dashboard: "/admin/reports/dashboard",
        mensual: "/admin/reports/monthly-sales",
        productos: "/admin/reports/top-products",
        vendedores: "/admin/reports/seller-ranking",
        sucursales: "/admin/reports/branch-performance",
        categorias: "/admin/reports/sales-by-category",
        margen: "/admin/reports/gross-margin",
    };

    const titulos = {
        dashboard: "Resumen general",
        mensual: "Ventas mensuales",
        productos: "Productos más vendidos",
        vendedores: "Ranking de vendedores",
        sucursales: "Rendimiento de sucursales",
        categorias: "Ventas por categoría",
        margen: "Margen bruto",
    };

    const cargarReporte = async () => {
        setLoading(true);
        setError("");
        setDatos(null);

        try {
            const response = await api.get(endpoints[reporte], {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            setDatos(response.data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudo cargar el reporte."
            );
        } finally {
            setLoading(false);
        }
    };

    const moneda = (valor) =>
        new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
        }).format(Number(valor || 0));

    const numero = (valor) =>
        new Intl.NumberFormat("es-MX").format(Number(valor || 0));

    const obtenerFilas = () => {
        if (!datos) return [];

        const posibles = [
            "ventas_mensuales",
            "top_productos",
            "ranking_vendedores",
            "rendimiento_sucursales",
            "ventas_por_categoria",
            "margen_bruto",
        ];

        for (const clave of posibles) {
            if (Array.isArray(datos[clave])) return datos[clave];
        }

        return [];
    };

    const filas = obtenerFilas();

    const colores = [
        "#2563eb",
        "#10b981",
        "#8b5cf6",
        "#f59e0b",
        "#ef4444",
        "#06b6d4",
    ];

    const renderGrafica = () => {
        if (!datos) return null;

        if (reporte === "mensual") {
            return (
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={filas}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="periodo" />
                        <YAxis />
                        <Tooltip formatter={(v) => moneda(v)} />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="ingresos"
                            name="Ingresos"
                            stroke="#2563eb"
                            strokeWidth={3}
                        />
                    </LineChart>
                </ResponsiveContainer>
            );
        }

        if (reporte === "productos") {
            return (
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={filas}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                            dataKey="unidades_vendidas"
                            name="Unidades vendidas"
                            fill="#10b981"
                        />
                    </BarChart>
                </ResponsiveContainer>
            );
        }

        if (reporte === "categorias") {
            return (
                <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                        <Pie
                            data={filas}
                            dataKey="ingresos"
                            nameKey="categoria"
                            cx="50%"
                            cy="50%"
                            outerRadius={120}
                            label
                        >
                            {filas.map((fila, index) => (
                                <Cell
                                    key={index}
                                    fill={colores[index % colores.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip formatter={(v) => moneda(v)} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            );
        }

        if (
            reporte === "vendedores" ||
            reporte === "sucursales"
        ) {
            return (
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={filas}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey={reporte === "vendedores" ? "name" : "nombre"}
                        />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                            dataKey={
                                reporte === "vendedores"
                                    ? "total_ventas"
                                    : "total_ventas"
                            }
                            name="Total de ventas"
                            fill="#8b5cf6"
                        />
                    </BarChart>
                </ResponsiveContainer>
            );
        }

        return null;
    };

    const renderTabla = () => {
        if (!datos) return null;

        if (reporte === "dashboard") {
            const resumen = datos.resumen || {};

            return (
                <div className="report-metrics">
                    <article className="report-metric">
                        <span>Ventas totales</span>
                        <strong>{numero(resumen.total_ventas)}</strong>
                    </article>

                    <article className="report-metric">
                        <span>Ingresos</span>
                        <strong>{moneda(resumen.ingresos)}</strong>
                    </article>

                    <article className="report-metric">
                        <span>Ticket promedio</span>
                        <strong>{moneda(resumen.ticket_promedio)}</strong>
                    </article>

                    <article className="report-metric">
                        <span>Unidades vendidas</span>
                        <strong>{numero(resumen.unidades_vendidas)}</strong>
                    </article>
                </div>
            );
        }

        if (!filas.length) {
            return <p className="report-empty">No hay registros disponibles.</p>;
        }

        return (
            <div className="report-table-container">
                <table className="report-table">
                    <thead>
                        <tr>
                            {Object.keys(filas[0]).map((columna) => (
                                <th key={columna}>{columna.replaceAll("_", " ")}</th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {filas.map((fila, index) => (
                            <tr key={index}>
                                {Object.entries(fila).map(([clave, valor]) => (
                                    <td key={clave}>
                                        {typeof valor === "number" &&
                                            (clave.includes("ingresos") ||
                                                clave.includes("monto") ||
                                                clave.includes("margen"))
                                            ? moneda(valor)
                                            : valor ?? "-"}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="reports-page">
            <header className="reports-header">
                <div>
                    <span className="reports-eyebrow">VENTASLITE / ADMINISTRACIÓN</span>
                    <h1>Reportes y estadísticas</h1>
                    <p>Consulta el rendimiento y los resultados de tu negocio.</p>
                </div>

                <NavLink to="/dashboard" className="reports-back">
                    ← Volver al dashboard
                </NavLink>
            </header>

            <section className="reports-filter">
                <div>
                    <label htmlFor="tipo-reporte">Seleccionar reporte</label>
                    <select
                        id="tipo-reporte"
                        value={reporte}
                        onChange={(e) => {
                            setReporte(e.target.value);
                            setDatos(null);
                            setError("");
                        }}
                    >
                        <option value="dashboard">Resumen general</option>
                        <option value="mensual">Ventas mensuales</option>
                        <option value="productos">Productos más vendidos</option>
                        <option value="vendedores">Ranking de vendedores</option>
                        <option value="sucursales">Rendimiento de sucursales</option>
                        <option value="categorias">Ventas por categoría</option>
                        <option value="margen">Margen bruto</option>
                    </select>
                </div>

                <button
                    className="reports-button"
                    onClick={cargarReporte}
                    disabled={loading}
                >
                    {loading ? "Consultando..." : "Consultar reporte"}
                </button>
            </section>

            {error && (
                <div className="reports-error">{error}</div>
            )}

            {loading && (
                <div className="reports-loading">
                    Cargando información...
                </div>
            )}

            {datos && !loading && (
                <>
                    <section className="reports-content">
                        <div className="reports-content-header">
                            <div>
                                <span>RESULTADOS</span>
                                <h2>{titulos[reporte]}</h2>
                            </div>
                            <span className="reports-status">Datos actualizados</span>
                        </div>

                        {reporte !== "dashboard" &&
                            reporte !== "margen" &&
                            renderGrafica()}

                        {renderTabla()}
                    </section>
                </>
            )}

            {!datos && !loading && !error && (
                <section className="reports-empty-state">
                    <div>▥</div>
                    <h2>Consulta tus reportes</h2>
                    <p>Selecciona un reporte y presiona consultar para visualizar sus resultados.</p>
                </section>
            )}

            <footer className="dashboard-footer">
                VentasLite © 2026 | Sistema de administración de ventas
            </footer>
        </div>
    );
}

export default Reports;