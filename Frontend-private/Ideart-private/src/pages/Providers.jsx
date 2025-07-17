import { useState, useEffect, useRef } from "react";
import EmpleadoCard from "../components/providersCart";
import Sidebar from "../components/Sidebar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
    genero: "Masculino",
    telefono: "1234-5678"
  },
  {
    id: 2,
    nombre: "Carolina Paredes",
    email: "carolina.paredes@outlook.com",
    foto: "/mujer.jpg",
    titulo: "Proveedor de Calzado",
    descripcion: "Especialista en calzado de cuero artesanal.",
    edad: 42,
    genero: "Femenino",
    telefono: "8765-4321"
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

  // Para guardar el id del empleado a eliminar tras confirmación
  const [empleadoEliminarId, setEmpleadoEliminarId] = useState(null);

  // Cierra panel de detalle/edición al hacer click fuera
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

  // Seleccionar proveedor para mostrar detalle
  function seleccionarEmpleado(emp) {
    setActivo(emp);
    setModoEdicion(false);
    setErrores({});
  }

  // Preparar formulario para agregar nuevo proveedor
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

  // Preparar formulario para editar proveedor seleccionado
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

  // Validación de formulario con mensajes de error en cada campo
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

  // Guardar nuevo proveedor o actualizar existente
  function guardarEmpleado(e) {
    e.preventDefault();

    const errs = validar();
    if (Object.keys(errs).length > 0) {
      setErrores(errs);
      toast.error("Corrige los errores del formulario");
      return;
    }

    if (activo) {
      // Actualizo proveedor existente
      const nuevos = empleados.map(emp =>
        emp.id === activo.id ? { ...emp, ...formData, edad: Number(formData.edad) } : emp
      );
      setEmpleados(nuevos);
      setActivo({ ...activo, ...formData, edad: Number(formData.edad) });
      toast.success("Proveedor actualizado con éxito");
    } else {
      // Agrego nuevo proveedor
      const nuevoEmp = {
        ...formData,
        id: empleados.length ? Math.max(...empleados.map(e => e.id)) + 1 : 1,
        edad: Number(formData.edad),
        foto: formData.foto || "/default.jpg"
      };
      setEmpleados([...empleados, nuevoEmp]);
      setActivo(nuevoEmp);
      toast.success("Proveedor agregado con éxito");
    }

    setModoEdicion(false);
    setErrores({});
  }

  // Cancelar edición o creación
  function cancelar() {
    setModoEdicion(false);
    setErrores({});
    setActivo(null);
    toast.info("Edición cancelada");
  }

  // *** NUEVO: Confirmación con toast para eliminar ***
  function confirmarEliminarEmpleado() {
    if (!activo) return;

    // Guardamos el id para eliminar después
    setEmpleadoEliminarId(activo.id);

    // Mostramos toast con botones Sí/No
    toast.info(
      ({ closeToast }) => (
        <div>
          <p>¿Estás seguro que deseas eliminar a <b>{activo.nombre}</b>?</p>
          <div style={{ display: "flex", justifyContent: "space-around", marginTop: 10 }}>
            <button
              onClick={() => {
                eliminarEmpleado(activo.id);
                closeToast();
              }}
              style={{
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Sí
            </button>
            <button
              onClick={() => closeToast()}
              style={{
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              No
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        draggable: false,
      }
    );
  }

  // Función que elimina al empleado y muestra toast de éxito
  function eliminarEmpleado(id) {
    setEmpleados(empleados.filter(emp => emp.id !== id));
    setActivo(null);
    setModoEdicion(false);
    setErrores({});
    setEmpleadoEliminarId(null);
    toast.success("Proveedor eliminado con éxito");
  }

  // Maneja selección de archivo imagen para preview local
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
                  <button onClick={confirmarEliminarEmpleado} className="btn-eliminar">Eliminar</button>
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

      {/* Contenedor para los toasts */}
      <ToastContainer />
    </div>
  );
}
