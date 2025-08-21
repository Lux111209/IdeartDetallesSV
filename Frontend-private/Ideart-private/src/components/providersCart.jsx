import React from "react";

// Componente EmpleadoCard para mostrar una tarjeta de empleado
export default function EmpleadoCard({ empleado, onSelect }) {
  return (
    <div className="card" onClick={() => onSelect(empleado)}>
      <img
        src={empleado.foto || "https://via.placeholder.com/100"}
        alt={empleado.nombre || "Empleado"}
        className="avatar"
      />
      <div className="info">
        <p className="nombre">{empleado.nombre || "Sin nombre"}</p>
        <p className="correo">{empleado.email || "Sin correo"}</p>
      </div>
    </div>
  );
}
