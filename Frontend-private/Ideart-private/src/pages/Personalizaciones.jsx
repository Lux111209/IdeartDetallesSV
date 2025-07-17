import { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
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
  const [mostrarPrecio, setMostrarPrecio] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [precio, setPrecio] = useState("");
  const [accionPendiente, setAccionPendiente] = useState(""); // "aceptar" o "rechazar"
  const panelRef = useRef(null);

  // Cierra panel al hacer click afuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        cerrarPanel();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Limpia y cierra paneles y estados
  const cerrarPanel = () => {
    setSeleccionado(null);
    setError("");
    setMostrarConfirmacion(false);
    setMostrarMotivo(false);
    setMostrarPrecio(false);
    setMotivo("");
    setPrecio("");
    setAccionPendiente("");
  };

  // Valida que todos los datos estén completos y correctos
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

  // Abre modal de confirmación para aceptar o rechazar
  const abrirConfirmacion = (accion) => {
    if (!validarSolicitud()) return;
    setAccionPendiente(accion);
    setMostrarConfirmacion(true);
  };

  // Acción confirmada en modal
  const confirmarAccion = () => {
    setMostrarConfirmacion(false);
    if (accionPendiente === "aceptar") {
      // Mostrar modal para ingresar precio
      setMostrarPrecio(true);
    } else if (accionPendiente === "rechazar") {
      // Mostrar modal para ingresar motivo rechazo
      setMostrarMotivo(true);
    }
  };

  // Enviar motivo de rechazo
  const enviarMotivo = () => {
    if (!motivo.trim()) {
      toast.error("Debes escribir un motivo para rechazar.");
      return;
    }
    toast.success("❌ Solicitud rechazada con éxito");
    cerrarPanel();
  };

  // Enviar precio tras aceptar solicitud
  const enviarPrecio = () => {
    if (!precio.trim() || isNaN(precio) || Number(precio) <= 0) {
      toast.error("Ingresa un precio válido mayor a 0.");
      return;
    }
    toast.success(`✅ Solicitud aceptada con precio $${precio}`);
    cerrarPanel();
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="contenedor-personalizaciones">
        {/* Lista de solicitudes */}
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

        {/* Panel detalle solicitud */}
        {seleccionado && (
          <div className="panel-detalle" ref={panelRef}>
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

            {/* Mensaje de error si hay */}
            {error && <p className="mensaje-error">{error}</p>}

            {/* Botones en línea y centrados */}
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

        {/* Modal confirmación aceptar/rechazar */}
        {mostrarConfirmacion && (
          <div className="popup-overlay" onClick={() => setMostrarConfirmacion(false)}>
            <div className="popup-contenido" onClick={(e) => e.stopPropagation()}>
              <h3>¿Estás seguro que deseas {accionPendiente} esta solicitud?</h3>
              <div className="modal-botones">
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
              <div className="modal-botones" style={{ justifyContent: "flex-end" }}>
                <button className="btn aceptar" onClick={enviarMotivo}>
                  Enviar motivo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal ingresar precio */}
        {mostrarPrecio && (
          <div className="popup-overlay" onClick={() => setMostrarPrecio(false)}>
            <div className="popup-contenido" onClick={(e) => e.stopPropagation()}>
              <h3>Ingresa el precio para la solicitud</h3>
              <input
                type="number"
                min="0"
                placeholder="Precio"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                style={{ padding: "0.5rem", fontSize: "1rem", borderRadius: "6px", border: "1px solid #ccc" }}
              />
              <div className="modal-botones" style={{ justifyContent: "flex-end" }}>
                <button className="btn aceptar" onClick={enviarPrecio}>
                  Enviar precio
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Contenedor Toast */}
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}
