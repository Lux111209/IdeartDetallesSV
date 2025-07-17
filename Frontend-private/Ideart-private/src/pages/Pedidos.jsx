import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import Sidebar from "../components/Sidebar";
import PedidoCard from "../components/PedidoCard";
import DetallePedido from "../components/DetallePedido";

import pedidos from "../data/pedidos";
import "react-toastify/dist/ReactToastify.css";
import "../css/Pedidos.css";

export default function Pedidos() {
  // Estado para almacenar el pedido seleccionado
  const [seleccionado, setSeleccionado] = useState(null);
  // Controla si se muestra el popup de confirmación
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  // Guarda la acción pendiente que se debe confirmar (ej. "descargar")
  const [accionPendiente, setAccionPendiente] = useState("");

  // Referencia al panel de detalles para detectar clicks fuera
  const panelRef = useRef();

  // Hook para detectar clicks fuera del panel y cerrar detalles
  useEffect(() => {
    const manejarClick = (e) => {
      if (
        seleccionado && 
        panelRef.current && 
        !panelRef.current.contains(e.target)
      ) {
        // Si se clickea fuera del panel, se cierra el detalle y popup
        setSeleccionado(null);
        setMostrarConfirmacion(false);
        setAccionPendiente("");
      }
    };
    document.addEventListener("mousedown", manejarClick);
    return () => document.removeEventListener("mousedown", manejarClick);
  }, [seleccionado]);

  // Marca el pedido como completado y muestra notificación
  const completarPedido = () => {
    toast.success("✅ Pedido marcado como completado");
    setSeleccionado(null); // Cierra panel detalles
  };

  // Cancela el pedido y muestra notificación
  const cancelarPedido = () => {
    toast.info("❌ Pedido cancelado");
    setSeleccionado(null); // Cierra panel detalles
  };

  // Abre el popup de confirmación para una acción específica
  const abrirConfirmacion = (accion) => {
    setAccionPendiente(accion);
    setMostrarConfirmacion(true);
  };

  // Genera y descarga un PDF con los datos del pedido
  const generarPDF = (pedido) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Reporte de Pedido", 14, 20);

    // Datos básicos del pedido
    doc.setFontSize(12);
    doc.text(`Cliente: ${pedido.nombre}`, 14, 35);
    doc.text(`Email: ${pedido.email}`, 14, 42);
    doc.text(`Número de pedido: ${pedido.numero}`, 14, 49);
    doc.text(`Ubicación: ${pedido.ubicacion || "San Salvador"}`, 14, 56);

    // Tabla con productos usando autoTable
    autoTable(doc, {
      startY: 65,
      head: [["Producto", "Cantidad", "Precio"]],
      body:
        pedido.productos?.map((producto) => [
          producto.nombre,
          producto.cantidad,
          `$${producto.precio.toFixed(2)}`,
        ]) || [["-", "-", "-"]],
    });

    // Calcular y mostrar total
    const total = pedido.productos?.reduce(
      (acc, p) => acc + p.cantidad * p.precio,
      0
    );

    doc.text(`Total: $${total?.toFixed(2) || "0.00"}`, 14, doc.lastAutoTable.finalY + 10);

    // Descargar archivo PDF con nombre que incluye número del pedido
    doc.save(`pedido_${pedido.numero}.pdf`);
  };

  // Función que se ejecuta al confirmar una acción en el popup
  const confirmarAccion = () => {
    if (accionPendiente === "descargar" && seleccionado) {
      generarPDF(seleccionado);
      toast.success("📥 Reporte descargado");
    }
    setMostrarConfirmacion(false); // Cierra popup confirmación
  };

  return (
    <div className="layout">
      <Sidebar /> {/* Barra lateral fija */}

      <div className="contenedor-pedidos">
        {/* Lista de pedidos con sus tarjetas */}
        <div className="lista-pedidos">
          <h2>Pedidos</h2>
          <div className="cards-contenedor">
            {pedidos.map((pedido) => (
              <PedidoCard
                key={pedido.id}
                pedido={pedido}
                activo={seleccionado?.id === pedido.id}
                onClick={() => setSeleccionado(pedido)} // Selecciona pedido para mostrar detalles
              />
            ))}
          </div>
        </div>

        {/* Panel de detalles solo si hay pedido seleccionado */}
        {seleccionado && (
          <div className="detalle-wrapper" ref={panelRef}>
            <DetallePedido
              pedido={seleccionado}
              onCompletar={completarPedido}
              onCancelar={cancelarPedido}
              onDescargar={() => abrirConfirmacion("descargar")}
            />
          </div>
        )}

        {/* Popup de confirmación para acciones importantes */}
        {mostrarConfirmacion && (
          <div className="popup-overlay" onClick={() => setMostrarConfirmacion(false)}>
            <div className="popup-contenido" onClick={(e) => e.stopPropagation()}>
              <h3>¿Deseas continuar con la acción: {accionPendiente}?</h3>
              <div className="botones">
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
