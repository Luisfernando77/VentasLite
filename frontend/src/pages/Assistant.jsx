import { useState } from "react";
import api from "../services/api";

function Assistant() {
    const [pregunta, setPregunta] = useState("");
    const [respuesta, setRespuesta] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const consultarIA = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError("");
        setRespuesta(null);

        try {
            const response = await api.post(
                "/admin/assistant/ask",
                {
                    pregunta,
                    resumen_ejecutivo: false,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            setRespuesta(response.data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No fue posible consultar al asistente."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "30px" }}>
            <h1>Asistente de IA</h1>
            <p>Consulta información sobre las ventas de tu empresa.</p>

            <form onSubmit={consultarIA}>
                <textarea
                    value={pregunta}
                    onChange={(e) => setPregunta(e.target.value)}
                    placeholder="Ejemplo: ¿Cuáles son los productos más vendidos?"
                    required
                    rows="4"
                    style={{
                        width: "100%",
                        padding: "12px",
                        marginTop: "20px",
                        borderRadius: "8px",
                    }}
                />

                <button
                    type="submit"
                    disabled={loading}
                    style={{ marginTop: "12px", padding: "12px 20px" }}
                >
                    {loading ? "Consultando..." : "Consultar asistente"}
                </button>
            </form>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {respuesta && (
                <div style={{
                    marginTop: "25px",
                    padding: "20px",
                    background: "white",
                    borderRadius: "8px",
                    overflowX: "auto"
                }}>
                    <h3>Respuesta</h3>
                    <pre style={{ whiteSpace: "pre-wrap" }}>
                        {JSON.stringify(respuesta, null, 2)}
                    </pre>
                </div>
            )}

            <button
                onClick={() => window.location.href = "/dashboard"}
                style={{ marginTop: "20px" }}
            >
                Volver al dashboard
            </button>
        </div>
    );
}

export default Assistant;