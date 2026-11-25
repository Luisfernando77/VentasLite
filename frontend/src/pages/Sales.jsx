import { useEffect, useState } from "react";
import api from "../services/api";

function Sales() {
    const [ventas, setVentas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const cargarVentas = async () => {
        try {
            const response = await api.get("/sales", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            setVentas(response.data.data || []);
        } catch (err) {
            setError("No se pudieron cargar las ventas.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarVentas();
    }, []);

    return (
        <div style={{ padding: "30px" }}>
            <h1>Listado de ventas</h1>

            <button onClick={() => window.location.href = "/dashboard"}>
                Volver al dashboard
            </button>

            {loading && <p>Cargando ventas...</p>}
            {error && <p>{error}</p>}

            {!loading && !error && (
                <div style={{ overflowX: "auto", marginTop: "20px" }}>
                    <table width="100%" cellPadding="12" style={{
                        borderCollapse: "collapse",
                        background: "white",
                        textAlign: "left"
                    }}>
                        <thead>
                            <tr style={{ background: "#2563eb", color: "white" }}>
                                <th>ID</th>
                                <th>Vendedor</th>
                                <th>Fecha</th>
                                <th>Total</th>
                                <th>Estado</th>
                            </tr>
                        </thead>

                        <tbody>
                            {ventas.map(venta => (
                                <tr key={venta.id} style={{ borderBottom: "1px solid #ddd" }}>
                                    <td>{venta.id}</td>
                                    <td>{venta.user?.name || venta.user_id}</td>
                                    <td>{venta.created_at?.substring(0, 10)}</td>
                                    <td>
                                        {Number(venta.total).toLocaleString("es-MX", {
                                            style: "currency",
                                            currency: "MXN"
                                        })}
                                    </td>
                                    <td>{venta.status || venta.estatus || "Registrada"}</td>
                                </tr>
                            ))}

                            {ventas.length === 0 && (
                                <tr>
                                    <td colSpan="5">No hay ventas registradas.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default Sales;