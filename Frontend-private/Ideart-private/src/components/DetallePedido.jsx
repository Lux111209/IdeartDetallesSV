import React from "react";

// Este componente muestra el detalle del pedido seleccionado
export default function DetallePedido({ pedido, onCompletar, onCancelar, onDescargar }) {
  if (!pedido) return null; // si no hay pedido, no renderiza nada

  return (
    <div className="detalle-pedido">
      <h2>Pedido #{pedido.numero}</h2>
      <p><strong>Cliente:</strong> {pedido.nombre}</p>
      <p><strong>Email:</strong> {pedido.email}</p>
      <p><strong>Fecha:</strong> {pedido.fecha || "12/07/2025"}</p>
      <p><strong>Estado:</strong> {pedido.estado || "Pendiente"}</p>

      <h3>Productos</h3>
      <div className="productos-lista">
        {pedido.productos?.length > 0 ? (
          pedido.productos.map((producto, index) => (
            <div className="producto-detalle" key={index}>
              <img
                src={producto.imagen || "https://via.placeholder.com/80"}
                alt={producto.nombre}
                className="imagen-producto"
              />
              <div className="info-producto">
                <p className="titulo">{producto.nombre}</p>
                <p className="extra-info">Cantidad: {producto.cantidad}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No hay productos en este pedido.</p>
        )}
      </div>

      {/* Botones de acciones */}
      <div className="botones">
        <button className="btn completado" onClick={onCompletar}>
          ✅ Completar Pedido
        </button>
        <button className="btn cancelar" onClick={onCancelar}>
          ❌ Cancelar Pedido
        </button>
        <button className="btn descargar" onClick={onDescargar}>
          ⬇️ Descargar
        </button>
      </div>
    </div>
  );
}
