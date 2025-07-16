// Personalizaciones.jsx
import { useState } from "react";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import PersonalizacionCard from "../components/PersonalizacionCard";
import "react-toastify/dist/ReactToastify.css";
import "../css/Personalizaciones.css";

const solicitudes = [
  {
    id: 1,
    nombre: "Jason Alberto",
    producto: "Camisas",
    email: "jasonalberto@gmail.com",
    cantidad: 35,
    imagen: "/charli.jpg",
    descripcion: "Lorem ipsum dolor sit amet.",
  },
];

export default function Personalizaciones() {
  const [seleccionado, setSeleccionado] = useState(null);
  const [error, setError] = useState("");
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [mostrarMotivo, setMostrarMotivo] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [accionPendiente, setAccionPendiente] = useState(""); // "aceptar" o "rechazar"

  const cerrarPanel = () => {
    setSeleccionado(null);
    setError("");
    setMostrarMotivo(false);
    setMotivo("");
    setMostrarConfirmacion(false);
    setAccionPendiente("");
  };

  const validarSolicitud = () => {
    if (!seleccionado) return false;
    const { nombre, producto, email, cantidad } = seleccionado;
    if (!nombre || !producto || !email || !cantidad) {
      setError("Todos los campos son obligatorios.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("El correo electrónico no es válido.");
      return false;
    }
    if (isNaN(cantidad) || cantidad <= 0) {
      setError("La cantidad debe ser un número positivo.");
      return false;
    }
    setError("");
    return true;
  };

  const abrirConfirmacion = (accion) => {
    if (!validarSolicitud()) return;
    setAccionPendiente(accion);
    setMostrarConfirmacion(true);
  };

  const confirmarAccion = () => {
    if (accionPendiente === "aceptar") {
      toast.success("✅ Solicitud aceptada con éxito");
      cerrarPanel();
    } else if (accionPendiente === "rechazar") {
      setMostrarMotivo(true);
    }
    setMostrarConfirmacion(false);
  };

  const enviarMotivo = () => {
    if (!motivo.trim()) {
      toast.error("Debes escribir un motivo para rechazar.");
      return;
    }
    toast.success("❌ Solicitud rechazada con éxito");
    cerrarPanel();
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="contenedor-personalizaciones">
        <div className="lista-solicitudes">
          <h2>Solicitud de personalizaciones</h2>
          <div className="cards-contenedor">
            {solicitudes.map((item) => (
              <PersonalizacionCard
                key={item.id}
                item={item}
                activo={seleccionado?.id === item.id}
                onClick={() => {
                  setSeleccionado(item);
                  setError("");
                }}
              />
            ))}
          </div>
        </div>

        {seleccionado && (
          <div className="panel-detalle">
            <img
              src={seleccionado.imagen}
              alt="producto personalizado"
              className="imagen-producto"
            />
            <h3>{seleccionado.nombre}</h3>
            <p className="rol">Cliente</p>
            <p>{seleccionado.descripcion}</p>
            <p><strong>Cantidad:</strong> {seleccionado.cantidad}</p>
            <p><strong>Email:</strong> {seleccionado.email}</p>

            {error && <p className="mensaje-error">{error}</p>}

            <div className="botones">
              <button className="btn aceptar" onClick={() => abrirConfirmacion("aceptar")}>
                Aceptar
              </button>
              <button className="btn cancelar" onClick={cerrarPanel}>
                Cancelar
              </button>
              <button className="btn rechazar" onClick={() => abrirConfirmacion("rechazar")}>
                Rechazar
              </button>
            </div>
          </div>
        )}

        {/* Modal confirmación */}
        {mostrarConfirmacion && (
          <div className="popup-overlay" onClick={() => setMostrarConfirmacion(false)}>
            <div className="popup-contenido" onClick={(e) => e.stopPropagation()}>
              <h3>¿Estás seguro que deseas {accionPendiente} esta solicitud?</h3>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button className="btn cancelar" onClick={() => setMostrarConfirmacion(false)}>
                  Cancelar
                </button>
                <button className="btn aceptar" onClick={confirmarAccion}>
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal motivo rechazo */}
        {mostrarMotivo && (
          <div className="popup-overlay" onClick={() => setMostrarMotivo(false)}>
            <div className="popup-contenido" onClick={(e) => e.stopPropagation()}>
              <h3>Motivo del rechazo</h3>
              <textarea
                placeholder="Escribe el motivo..."
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
              />
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button className="btn aceptar" onClick={enviarMotivo}>
                  Enviar motivo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}