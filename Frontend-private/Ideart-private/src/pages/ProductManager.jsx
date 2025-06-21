import { useState } from "react";
import Sidebar from "../components/Sidebar";
import EmpleadoCard from "../components/providersCart";
import "../css/Providers.css";

const proveedores = [
  {
    id: 1,
    nombre: "Jason Alberto",
    email: "jasonalberto@gmail.com",
    foto: "https://via.placeholder.com/80",
    titulo: "Proveedor de Ropa",
    descripcion: "Entrega semanal de mercancía desde Colombia.",
    edad: 35,
    genero: "Masculino",
  },
  {
    id: 2,
    nombre: "Carolina Paredes",
    email: "carolina.paredes@outlook.com",
    foto: "https://via.placeholder.com/80",
    titulo: "Proveedor de Calzado",
    descripcion: "Especialista en calzado de cuero artesanal.",
    edad: 42,
    genero: "Femenino",
  },
];

export default function Providers() {
  const [activo, setActivo] = useState(null);

  return (
    <div className="layout">
      <Sidebar />

      <div className="main-content">
        <div className="panel-izquierdo">
          <h1 className="titulo">Proveedores</h1>
          {proveedores.map((prov) => (
            <EmpleadoCard
              key={prov.id}
              empleado={prov}
              onSelect={setActivo} // aquí le pasas directamente el setActivo
            />
          ))}
        </div>

        {activo ? (
          <div className="panel-derecho">
            <img
              src={activo.foto}
              alt={activo.nombre}
              className="avatar-grande"
            />
            <h2>{activo.nombre}</h2>
            <p className="subtitulo">{activo.titulo}</p>
            <p>{activo.descripcion}</p>
            <p>
              <strong>Edad:</strong> {activo.edad}
            </p>
            <p>
              <strong>Género:</strong> {activo.genero}
            </p>
            <p>
              <strong>Email:</strong> {activo.email}
            </p>
          </div>
        ) : (
          <div className="panel-derecho placeholder">
            <p>Selecciona un proveedor para ver detalles</p>
          </div>
        )}
      </div>
    </div>
  );
}
