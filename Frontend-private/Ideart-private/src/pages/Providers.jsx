// src/pages/Providers.jsx
import { useState, useEffect, useRef } from "react";
import EmpleadoCard from "../components/providersCart";
import Sidebar from "../components/Sidebar"; 
import "../css/Providers.css";

const empleadosIniciales = [
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

export default function Providers() {
  const [empleados, setEmpleados] = useState(empleadosIniciales);
  const [activo, setActivo] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    foto: "",
    titulo: "",
    descripcion: "",
    edad: "",
    genero: "",
    telefono: ""
  });
  
  const [errores, setErrores] = useState({});

  const panelDerechoRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        panelDerechoRef.current &&
        !panelDerechoRef.current.contains(event.target)
      ) {
        if (modoEdicion || activo) {
          setActivo(null);
          setModoEdicion(false);
          setErrores({});
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activo, modoEdicion]);

  function seleccionarEmpleado(emp) {
    setActivo(emp);
    setModoEdicion(false);
    setErrores({});
  }

  function agregarNuevo() {
    setActivo(null);
    setModoEdicion(true);
    setFormData({
      nombre: "",
      email: "",
      foto: "",
      titulo: "",
      descripcion: "",
      edad: "",
      genero: "",
      telefono: ""
    });
    setErrores({});
  }

  function editarEmpleado() {
    if (!activo) return;
    setFormData({
      nombre: activo.nombre,
      email: activo.email,
      foto: activo.foto,
      titulo: activo.titulo,
      descripcion: activo.descripcion,
      edad: activo.edad,
      genero: activo.genero,
      telefono: activo.telefono || ""
    });
    setModoEdicion(true);
    setErrores({});
  }

  function validar() {
    const errs = {};
    if (!formData.nombre.trim()) errs.nombre = "Nombre requerido";
    if (!formData.email.trim()) errs.email = "Email requerido";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      errs.email = "Email inválido";
    if (!formData.titulo.trim()) errs.titulo = "Título requerido";
    if (!formData.descripcion.trim()) errs.descripcion = "Descripción requerida";
    if (!formData.edad || isNaN(formData.edad) || formData.edad < 18)
      errs.edad = "Edad debe ser mayor o igual a 18";
    if (!formData.genero.trim()) errs.genero = "Género requerido";
    else if (!["Masculino", "Femenino"].includes(formData.genero))
      errs.genero = "Género debe ser 'Masculino' o 'Femenino'";
    if (!formData.telefono.trim()) errs.telefono = "Teléfono requerido";
    else if (!/^\d{4}-\d{4}$/.test(formData.telefono))
      errs.telefono = "Teléfono debe tener formato 0000-0000";
    return errs;
  }

  function guardarEmpleado(e) {
    e.preventDefault();

    const errs = validar();
    if (Object.keys(errs).length > 0) {
      setErrores(errs);
      return;
    }

    if (activo) {
      const nuevos = empleados.map(emp =>
        emp.id === activo.id ? { ...emp, ...formData, edad: Number(formData.edad) } : emp
      );
      setEmpleados(nuevos);
      setActivo({ ...activo, ...formData, edad: Number(formData.edad) });
    } else {
      const nuevoEmp = {
        ...formData,
        id: empleados.length ? Math.max(...empleados.map(e => e.id)) + 1 : 1,
        edad: Number(formData.edad),
        foto: formData.foto || "/default.jpg"
      };
      setEmpleados([...empleados, nuevoEmp]);
      setActivo(nuevoEmp);
    }

    setModoEdicion(false);
    setErrores({});
  }

  function cancelar() {
    setModoEdicion(false);
    setErrores({});
    setActivo(null);
  }

  function eliminarEmpleado() {
    if (!activo) return;
    if (window.confirm(`¿Eliminar proveedor ${activo.nombre}?`)) {
      setEmpleados(empleados.filter(emp => emp.id !== activo.id));
      setActivo(null);
      setModoEdicion(false);
      setErrores({});
    }
  }

  // Manejo archivo de imagen para subir desde dispositivo
  function manejarArchivoImagen(e) {
    const archivo = e.target.files[0];
    if (archivo) {
      const urlLocal = URL.createObjectURL(archivo);
      setFormData(prev => ({ ...prev, foto: urlLocal }));
    }
  }

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="main">
        <h1 className="titulo">Proveedores</h1>

        <div className={`contenedor${!activo && !modoEdicion ? " sin-seleccion" : ""}`}>
          <div className="panel-izquierdo">
            {empleados.map(emp => (
              <EmpleadoCard key={emp.id} empleado={emp} onSelect={seleccionarEmpleado} />
            ))}

            <button className="btn-agregar" onClick={agregarNuevo}>
              + Agregar nuevo proveedor
            </button>
          </div>

          <div className="panel-derecho" ref={panelDerechoRef}>
            {!activo && !modoEdicion && <p>Selecciona un proveedor o agrega uno nuevo.</p>}

            {activo && !modoEdicion && (
              <>
                <img src={activo.foto} alt={activo.nombre} className="avatar-grande" />
                <h2>{activo.nombre}</h2>
                <p className="subtitulo">{activo.titulo}</p>
                <p>{activo.descripcion}</p>
                <p><strong>Edad:</strong> {activo.edad}</p>
                <p><strong>Género:</strong> {activo.genero}</p>
                <p><strong>Teléfono:</strong> {activo.telefono}</p>
                <p><strong>Email:</strong> {activo.email}</p>

                <div className="botones-derecha">
                  <button onClick={editarEmpleado} className="btn-editar">Editar</button>
                  <button onClick={eliminarEmpleado} className="btn-eliminar">Eliminar</button>
                </div>
              </>
            )}

            {modoEdicion && (
              <form onSubmit={guardarEmpleado} className="formulario" noValidate>
                <label>
                  Nombre:
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                  />
                  {errores.nombre && <span className="error">{errores.nombre}</span>}
                </label>

                <label>
                  Email:
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                  {errores.email && <span className="error">{errores.email}</span>}
                </label>

                <label>
                  Foto:
                  <input
                    type="file"
                    accept="image/*"
                    onChange={manejarArchivoImagen}
                  />
                </label>

                {formData.foto && (
                  <img
                    src={formData.foto}
                    alt="Preview"
                    style={{ width: "100px", height: "100px", objectFit: "cover", marginTop: "10px", borderRadius: "8px" }}
                  />
                )}

                <label>
                  Título:
                  <input
                    type="text"
                    value={formData.titulo}
                    onChange={e => setFormData({ ...formData, titulo: e.target.value })}
                  />
                  {errores.titulo && <span className="error">{errores.titulo}</span>}
                </label>

                <label>
                  Descripción:
                  <textarea
                    value={formData.descripcion}
                    onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
                  />
                  {errores.descripcion && <span className="error">{errores.descripcion}</span>}
                </label>

                <label>
                  Edad:
                  <input
                    type="number"
                    value={formData.edad}
                    onChange={e => setFormData({ ...formData, edad: e.target.value })}
                  />
                  {errores.edad && <span className="error">{errores.edad}</span>}
                </label>

                <label>
                  Género:
                  <select
                    value={formData.genero}
                    onChange={e => setFormData({ ...formData, genero: e.target.value })}
                  >
                    <option value="">-- Selecciona género --</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                  </select>
                  {errores.genero && <span className="error">{errores.genero}</span>}
                </label>

                <label>
                  Teléfono:
                  <input
                    type="text"
                    placeholder="0000-0000"
                    value={formData.telefono}
                    onChange={e => setFormData({ ...formData, telefono: e.target.value })}
                    maxLength={9}
                  />
                  {errores.telefono && <span className="error">{errores.telefono}</span>}
                </label>

                <div className="botones-formulario">
                  <button type="submit" className="btn-guardar">Guardar</button>
                  <button type="button" onClick={cancelar} className="btn-cancelar">Cancelar</button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
