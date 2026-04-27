import { useState } from "react";
import "./App.css";

function App() {
  const [cliente, setCliente] = useState({
    idCliente: "",
    nombre: "",
    email: "",
    telefono: "",
    ciudad: "",
    perfilCompra: "DIGITAL",
  });

  const [estadoHttp, setEstadoHttp] = useState(null);
  const [respuesta, setRespuesta] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const manejarCambio = (event) => {
    const { name, value } = event.target;

    setCliente({
      ...cliente,
      [name]: value,
    });
  };

  const procesarCliente = async (event) => {
    event.preventDefault();

    setCargando(true);
    setError("");
    setEstadoHttp(null);
    setRespuesta(null);

    try {
      const response = await fetch("http://localhost:8089/api/clientes/enviar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cliente),
      });

      const data = await response.json();

      setEstadoHttp(response.status);
      setRespuesta(data);
    } catch (error) {
      setError("No se pudo consumir la API. Verifica que el servicio integration-service esté encendido en el puerto 8089.");
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <h2>Integración de Clientes segun su perfil de compra</h2>
        <p className="subtitle">Framework de integracion: Apache Camel sobre Spring Boot</p>
        <p className="subtitle">Patron de integracion: Content-Based Router</p>        
        <p className="subtitle">Envio de clientes desde Empresa XYZ hacia  CIA 123 (Digital) o CIA ABC (Presencial)</p>

        <form className="card form-card" onSubmit={procesarCliente}>
          <div className="grid">
            <div className="field">
              <label>ID Cliente</label>
              <input
                type="text"
                name="idCliente"
                value={cliente.idCliente}
                onChange={manejarCambio}
                placeholder="C001"
                required
              />
            </div>

            <div className="field">
              <label>Nombre</label>
              <input
                type="text"
                name="nombre"
                value={cliente.nombre}
                onChange={manejarCambio}
                placeholder="Alex Pozo"
                required
              />
            </div>

            <div className="field">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={cliente.email}
                onChange={manejarCambio}
                placeholder="apozo@correo.com"
                required
              />
            </div>

            <div className="field">
              <label>Teléfono</label>
              <input
                type="text"
                name="telefono"
                value={cliente.telefono}
                onChange={manejarCambio}
                placeholder="09987654322"
                required
              />
            </div>

            <div className="field">
              <label>Ciudad</label>
              <input
                type="text"
                name="ciudad"
                value={cliente.ciudad}
                onChange={manejarCambio}
                placeholder="Guayaquil"
                required
              />
            </div>

            <div className="field">
              <label>Perfil de compra</label>
              <select
                name="perfilCompra"
                value={cliente.perfilCompra}
                onChange={manejarCambio}
              >
                <option value="DIGITAL">DIGITAL - Empresa 123</option>
                <option value="PRESENCIAL">PRESENCIAL - Empresa ABC</option>
                <option value="OTRO">OTRO - NO Envia a ninguna Empresa</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={cargando}>
            {cargando ? "Procesando..." : "Procesar Cliente"}
          </button>
        </form>

        <div className="result-section">
          <div className="card">
            <h2>JSON enviado</h2>
            <pre>{JSON.stringify(cliente, null, 2)}</pre>
          </div>

          <div className="card">
            <h2>Respuesta API</h2>

            {estadoHttp && (
              <p className={estadoHttp >= 200 && estadoHttp < 300 ? "ok" : "error"}>
                Estado HTTP: {estadoHttp}
              </p>
            )}

            {error && <p className="error">{error}</p>}

            {respuesta ? (
              <pre>{JSON.stringify(respuesta, null, 2)}</pre>
            ) : (
              <p className="empty">Aún no hay respuesta.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;