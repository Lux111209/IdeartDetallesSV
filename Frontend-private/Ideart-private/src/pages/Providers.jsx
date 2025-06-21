import { useState } from "react";
import EmpleadoCard from "../components/providersCart";
import Sidebar from "../components/Sidebar"; 
import "../css/Providers.css";

const empleados = [
  {
    id: 1,
    nombre: "Jason Alberto",
    email: "jasonalberto@gmail.com",
    foto: "/hombre.jpg",
    titulo: "Proveedor de Ropa",
    descripcion: "Entrega semanal de mercancía desde Colombia.",
    edad: 35,
    genero: "Masculino"
  },
  {
    id: 2,
    nombre: "Carolina Paredes",
    email: "carolina.paredes@outlook.com",
    foto: "/mujer.jpg",
    titulo: "Proveedor de Calzado",
    descripcion: "Especialista en calzado de cuero artesanal.",
    edad: 42,
    genero: "Femenino"
  }
];

export default function HomePage() {
  const [activo, setActivo] = useState(null);

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="main">
        <h1 className="titulo">Proveedores</h1>

        <div className="contenedor">
          <div className="panel-izquierdo">
            {empleados.map(emp => (
              <EmpleadoCard key={emp.id} empleado={emp} onSelect={setActivo} />
            ))}
          </div>

          {activo && (
            <div className="panel-derecho">
              <img src={activo.foto} alt={activo.nombre} className="avatar-grande" />
              <h2>{activo.nombre}</h2>
              <p className="subtitulo">{activo.titulo}</p>
              <p>{activo.descripcion}</p>
              <p><strong>Edad:</strong> {activo.edad}</p>
              <p><strong>Género:</strong> {activo.genero}</p>
              <p><strong>Email:</strong> {activo.email}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
