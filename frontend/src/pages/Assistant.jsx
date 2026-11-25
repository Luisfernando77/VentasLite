import { useState } from "react";
import { NavLink } from "react-router-dom";
import api from "../services/api";
import "../App.css";

function Assistant() {
    const [pregunta, setPregunta] = useState("");
    const [respuesta, setRespuesta] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [historial, setHistorial] = useState([]);

    const ejemplos = [
        "¿Cuáles son los productos más vendidos?",
        "¿Cuánto hemos vendido?",
        "¿Quién es nuestro mejor vendedor?",
        "¿Cómo está el rendimiento de las sucursales?",
    ];

    const consultarIA = async (e, texto = pregunta) => {
        e?.preventDefault();

        if (!texto.trim() || loading) return;

        setLoading(true);
        setError("");
        setRespuesta(null);

        const nuevaPregunta = texto.trim();
        setPregunta("");

        setHistorial((prev) => [
            ...prev,
            { tipo: "usuario", texto: nuevaPregunta },
        ]);

        try {
            const response = await api.post(
                "/admin/assistant/ask",
                {
                    pregunta: nuevaPregunta,
                    resumen_ejecutivo: false,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            setRespuesta(response.data);

            setHistorial((prev) => [
                ...prev,
                {
                    tipo: "asistente",
                    texto:
                        response.data.respuesta ||
                        response.data.message ||
                        JSON.stringify(response.data, null, 2),
                },
            ]);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "No fue posible consultar al asistente."
            );
        } finally {
            setLoading(false);
        }
    };

    const limpiarConversacion = () => {
        setHistorial([]);
        setRespuesta(null);
        setError("");
    };

    return (
        <div className="assistant-page">
            <header className="assistant-header">
                <div>
                    <span className="assistant-eyebrow">
                        VENTASLITE / INTELIGENCIA ARTIFICIAL
                    </span>
                    <h1>Asistente IA</h1>
                    <p>Tu asistente inteligente para analizar el negocio.</p>
                </div>

                <NavLink to="/dashboard" className="assistant-back">
                    ← Volver al dashboard
                </NavLink>
            </header>

            <main className="assistant-container">
                <section className="assistant-chat">
                    <div className="assistant-chat-header">
                        <div className="assistant-avatar">✧</div>

                        <div>
                            <h2>Asistente VentasLite</h2>
                            <span>
                                <i></i> Disponible para consultas
                            </span>
                        </div>

                        <button
                            className="assistant-clear"
                            onClick={limpiarConversacion}
                        >
                            Limpiar chat
                        </button>
                    </div>

                    <div className="assistant-messages">
                        {historial.length === 0 && (
                            <div className="assistant-welcome">
                                <div className="assistant-welcome-icon">✧</div>
                                <h2>¿En qué puedo ayudarte?</h2>
                                <p>
                                    Pregúntame sobre ventas, productos,
                                    vendedores o rendimiento de tu negocio.
                                </p>

                                <div className="assistant-examples">
                                    {ejemplos.map((ejemplo, index) => (
                                        <button
                                            key={index}
                                            onClick={() => consultarIA(null, ejemplo)}
                                            disabled={loading}
                                        >
                                            {ejemplo}
                                            <span>→</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {historial.map((mensaje, index) => (
                            <div
                                key={index}
                                className={`assistant-message ${mensaje.tipo}`}
                            >
                                <div className="message-avatar">
                                    {mensaje.tipo === "usuario" ? "U" : "✧"}
                                </div>

                                <div className="message-content">
                                    <span>
                                        {mensaje.tipo === "usuario"
                                            ? "Tú"
                                            : "Asistente IA"}
                                    </span>
                                    <p>{mensaje.texto}</p>
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="assistant-loading">
                                <div className="message-avatar">✧</div>
                                <div>
                                    <span>Analizando información...</span>
                                    <div className="assistant-dots">
                                        <i></i><i></i><i></i>
                                    </div>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="assistant-error">
                                {error}
                            </div>
                        )}
                    </div>

                    <form
                        className="assistant-input-area"
                        onSubmit={consultarIA}
                    >
                        <textarea
                            value={pregunta}
                            onChange={(e) => setPregunta(e.target.value)}
                            placeholder="Escribe tu pregunta sobre el negocio..."
                            rows="2"
                            disabled={loading}
                        />

                        <button
                            type="submit"
                            disabled={loading || !pregunta.trim()}
                        >
                            {loading ? "..." : "➤"}
                        </button>
                    </form>

                    <p className="assistant-disclaimer">
                        El asistente responde utilizando la información
                        disponible en VentasLite.
                    </p>
                </section>

                <aside className="assistant-sidebar">
                    <article className="assistant-info-card">
                        <div className="assistant-info-icon">✧</div>
                        <h3>Inteligencia para tu negocio</h3>
                        <p>
                            Consulta información y obtén respuestas
                            sobre el funcionamiento de tu empresa.
                        </p>
                    </article>

                    <article className="assistant-topics-card">
                        <h3>Temas disponibles</h3>

                        <div>▤ <span>Análisis de ventas</span></div>
                        <div>▣ <span>Productos más vendidos</span></div>
                        <div>♙ <span>Rendimiento de vendedores</span></div>
                        <div>▥ <span>Estadísticas del negocio</span></div>
                    </article>
                </aside>
            </main>

            <footer className="dashboard-footer">
                VentasLite © 2026 | Sistema de administración de ventas
            </footer>
        </div>
    );
}

export default Assistant;