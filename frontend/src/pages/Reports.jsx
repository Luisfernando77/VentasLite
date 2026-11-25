import { useState } from "react";
import api from "../services/api";

function Reports() {
    const [reporte, setReporte] = useState("dashboard");
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
            setError(err.response?.data?.message || "Error al cargar el reporte.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "30px" }}>
            <h1>Reportes</h1>

            <button onClick={() => window.location.href = "/dashboard"}>
                Volver al dashboard
            </button>

            <div style={{ margin: "25px 0" }}>
                <select
                    value={reporte}
                    onChange={(e) => setReporte(e.target.value)}
                    style={{ padding: "10px", marginRight: "10px" }}
                >
                    <option value="dashboard">Dashboard</option>
                    <option value="mensual">Ventas mensuales</option>
                    <option value="productos">Productos más vendidos</option>
                    <option value="vendedores">Ranking de vendedores</option>
                    <option value="sucursales">Rendimiento de sucursales</option>
                    <option value="categorias">Ventas por categoría</option>
                    <option value="margen">Margen bruto</option>
                </select>

                <button onClick={cargarReporte}>
                    Consultar reporte
                </button>
            </div>

            {loading && <p>Cargando reporte...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {datos && (
                <pre style={{
                    background: "white",
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

export default Reports;