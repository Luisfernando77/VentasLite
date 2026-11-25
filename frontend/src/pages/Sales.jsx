import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import api from "../services/api";
import "../App.css";

function Sales() {
    const [ventas, setVentas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [busqueda, setBusqueda] = useState("");
    const [estadoFiltro, setEstadoFiltro] = useState("todos");

    const cargarVentas = async () => {
        setLoading(true);
        setError("");

        try {
            const response = await api.get("/sales", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            setVentas(response.data.data || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No se pudieron cargar las ventas."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarVentas();
    }, []);

    const moneda = (valor) =>
        new Intl.NumberFormat("es-MX", {
            style: "currency",
            currency: "MXN",
        }).format(Number(valor || 0));

    const fecha = (valor) => {
        if (!valor) return "-";

        return new Date(valor).toLocaleDateString("es-MX", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const ventasFiltradas = ventas.filter((venta) => {
        const texto = busqueda.toLowerCase();

        const coincideBusqueda =
            String(venta.id).includes(texto) ||
            String(venta.user?.name || venta.user_id || "")
                .toLowerCase()
                .includes(texto);

        const estado = String(
            venta.status || venta.estatus || "Registrada"
        ).toLowerCase();

        const coincideEstado =
            estadoFiltro === "todos" ||
            estado === estadoFiltro;

        return coincideBusqueda && coincideEstado;
    });

    const totalIngresos = ventas.reduce(
        (total, venta) =>
            total + Number(venta.total || 0),
        0
    );

    const ventasPagadas = ventas.filter(
        (venta) =>
            String(venta.status || venta.estatus || "").toLowerCase() === "pagada"
    ).length;

    return (
        <div className="sales-page">

            <header className="sales-header">
                <div>
                    <span className="sales-eyebrow">
                        VENTASLITE / ADMINISTRACIÓN
                    </span>
                    <h1>Gestión de ventas</h1>
                    <p>Consulta y administra las operaciones de tu negocio.</p>
                </div>

                <div className="sales-header-actions">
                    <button
                        className="sales-refresh"
                        onClick={cargarVentas}
                        disabled={loading}
                    >
                        ↻ Actualizar
                    </button>

                    <NavLink to="/dashboard" className="sales-back">
                        ← Dashboard
                    </NavLink>
                </div>
            </header>

            <section className="sales-metrics">

                <article className="sales-metric">
                    <div className="sales-metric-icon blue">▤</div>
                    <div>
                        <span>Total de ventas</span>
                        <strong>{ventas.length}</strong>
                    </div>
                </article>

                <article className="sales-metric">
                    <div className="sales-metric-icon green">$</div>
                    <div>
                        <span>Importe registrado</span>
                        <strong>{moneda(totalIngresos)}</strong>
                    </div>
                </article>

                <article className="sales-metric">
                    <div className="sales-metric-icon purple">✓</div>
                    <div>
                        <span>Ventas pagadas</span>
                        <strong>{ventasPagadas}</strong>
                    </div>
                </article>

            </section>

            <section className="sales-content">

                <div className="sales-content-header">
                    <div>
                        <h2>Listado de ventas</h2>
                        <p>Historial de operaciones registradas.</p>
                    </div>

                    <span className="sales-counter">
                        {ventasFiltradas.length} registros
                    </span>
                </div>

                <div className="sales-filters">

                    <div className="sales-search">
                        <span>⌕</span>
                        <input
                            type="text"
                            placeholder="Buscar por ID o vendedor..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>

                    <select
                        value={estadoFiltro}
                        onChange={(e) => setEstadoFiltro(e.target.value)}
                    >
                        <option value="todos">Todos los estados</option>
                        <option value="pagada">Pagadas</option>
                        <option value="cancelada">Canceladas</option>
                        <option value="pendiente">Pendientes</option>
                    </select>

                </div>

                {loading && (
                    <div className="sales-message">
                        Cargando ventas...
                    </div>
                )}

                {error && (
                    <div className="sales-error">
                        {error}
                    </div>
                )}

                {!loading && !error && (
                    <div className="sales-table-container">
                        <table className="sales-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>VENDEDOR</th>
                                    <th>FECHA</th>
                                    <th>TOTAL</th>
                                    <th>ESTADO</th>
                                </tr>
                            </thead>

                            <tbody>
                                {ventasFiltradas.map((venta) => {
                                    const estado = String(
                                        venta.status ||
                                        venta.estatus ||
                                        "Registrada"
                                    );

                                    return (
                                        <tr key={venta.id}>
                                            <td>
                                                <strong>#{venta.id}</strong>
                                            </td>

                                            <td>
                                                <div className="sales-user">
                                                    <div className="sales-user-avatar">
                                                        {(venta.user?.name || "U")
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>
                                                    <span>
                                                        {venta.user?.name || venta.user_id || "Sin vendedor"}
                                                    </span>
                                                </div>
                                            </td>

                                            <td>
                                                {fecha(venta.sold_at || venta.created_at)}
                                            </td>

                                            <td className="sales-total">
                                                {moneda(venta.total)}
                                            </td>

                                            <td>
                                                <span
                                                    className={`sales-status ${estado.toLowerCase()}`}
                                                >
                                                    {estado}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}

                                {ventasFiltradas.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="sales-empty">
                                            No se encontraron ventas.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

            </section>

            <footer className="dashboard-footer">
                VentasLite © 2026 | Sistema de administración de ventas
            </footer>

        </div>
    );
}

export default Sales;