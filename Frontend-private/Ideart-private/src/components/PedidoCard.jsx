import React from "react";
import "../css/Pedidos.css";

// Componente PedidoCard para mostrar una tarjeta de pedido
export default function PedidoCard({ pedido, onClick, activo }) {
  if (!pedido) return null; // Evita errores si no hay datos

  return (
    <div
      className={`card-pedido ${activo ? "activa" : ""}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-pressed={activo}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      style={{
        cursor: "pointer",
        transition: "all 0.3s ease",
        transform: activo ? "scale(1.03)" : "scale(1)",
        boxShadow: activo
          ? "0 4px 12px rgba(0,0,0,0.2)"
          : "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      <div
        className="icono-cliente"
        style={{
          fontSize: "28px",
          marginRight: "12px",
        }}
      >
        👤
      </div>
      <div className="info" style={{ flex: 1 }}>
        <p className="nombre" style={{ fontWeight: "bold", margin: "0 0 4px 0" }}>
          {pedido.nombre || "Cliente sin nombre"}
        </p>
        <p style={{ margin: "0 0 2px 0" }}>N° {pedido.numero || "----"}</p>
        <p style={{ margin: 0, fontSize: "14px", color: "#555" }}>
          {pedido.email || "Correo no disponible"}
        </p>
      </div>
    </div>
  );
}
