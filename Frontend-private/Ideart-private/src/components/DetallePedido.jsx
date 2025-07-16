// src/components/DetallePedido.jsx
import React from "react";

export default function DetallePedido({ pedido, onCompletar, onCancelar, onDescargar }) {
  if (!pedido) return null;

  return (
    <div className="detalle-pedido">
      <h3>Detalle Pedido #{pedido.id}</h3>
      <p><strong>Cliente:</strong> {pedido.cliente}</p>
      <p><strong>Fecha:</strong> {pedido.fecha}</p>
      <p><strong>Estado:</strong> {pedido.estado}</p>
      <p><strong>Productos:</strong></p>
      <ul>
        {pedido.productos && pedido.productos.map((producto, index) => (
          <li key={index}>
            {producto.nombre} - Cantidad: {producto.cantidad}
          </li>
        ))}
      </ul>

      <div className="botones-accion" style={{ marginTop: "1rem", display: "flex", gap: "10px" }}>
        <button className="btn completar" onClick={onCompletar}>
          Completar Pedido
        </button>
        <button className="btn cancelar" onClick={onCancelar}>
          Cancelar Pedido
        </button>
        <button className="btn descargar" onClick={onDescargar}>
          Descargar
        </button>
      </div>
    </div>
  );
}
