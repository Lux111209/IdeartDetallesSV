import { useState } from "react";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import PedidoCard from "../components/PedidoCard";
import DetallePedido from "../components/DetallePedido";

import pedidos from "../data/pedidos";
import "react-toastify/dist/ReactToastify.css";
import "../css/Pedidos.css";

export default function Pedidos() {
  const [seleccionado, setSeleccionado] = useState(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [accionPendiente, setAccionPendiente] = useState("");

  const cerrarPanel = () => {
    setSeleccionado(null);
    setMostrarConfirmacion(false);
    setAccionPendiente("");
  };

  const completarPedido = () => {
    toast.success("✅ Pedido marcado como completado");
    cerrarPanel();
  };

  const cancelarPedido = () => {
    toast.info("❌ Pedido cancelado");
    cerrarPanel();
  };

  const abrirConfirmacion = (accion) => {
    setAccionPendiente(accion);
    setMostrarConfirmacion(true);
  };

  const confirmarAccion = () => {
    if (accionPendiente === "descargar") {
      toast.success("📥 Descarga realizada");
    }
    setMostrarConfirmacion(false);
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="contenedor-pedidos">
        <div className="lista-pedidos">
          <h2>Pedidos</h2>
          <div className="cards-contenedor">
            {pedidos.map((pedido) => (
              <PedidoCard
                key={pedido.id}
                pedido={pedido}
                activo={seleccionado?.id === pedido.id}
                onClick={() => setSeleccionado(pedido)}
              />
            ))}
          </div>
        </div>

        {seleccionado && (
          <DetallePedido
            pedido={seleccionado}
            onCompletar={completarPedido}
            onCancelar={cancelarPedido}
            onDescargar={() => abrirConfirmacion("descargar")}
          />
        )}

        {mostrarConfirmacion && (
          <div className="popup-overlay" onClick={() => setMostrarConfirmacion(false)}>
            <div className="popup-contenido" onClick={(e) => e.stopPropagation()}>
              <h3>¿Deseas continuar con la acción: {accionPendiente}?</h3>
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
      </div>
    </div>
  );
}
