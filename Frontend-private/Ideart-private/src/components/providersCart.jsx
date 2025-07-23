import React from "react";

// Componente EmpleadoCard para mostrar una tarjeta de empleado
export default function EmpleadoCard({ empleado, onSelect }) {
  return (
    <div className="card" onClick={() => onSelect(empleado)}>
      <img src={empleado.foto} alt={empleado.nombre} className="avatar" />
      <div className="info">
        <p className="nombre">{empleado.nombre}</p>
        <p className="correo">{empleado.email}</p>
      </div>
    </div>
  );
}
