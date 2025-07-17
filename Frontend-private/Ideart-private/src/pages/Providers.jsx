// src/pages/Providers.jsx
import { useState, useEffect, useRef } from "react";
import EmpleadoCard from "../components/providersCart";
import Sidebar from "../components/Sidebar"; 
import "../css/Providers.css";

// Configuración de la API
const API_BASE_URL = "http://localhost:5000/api";

// Servicios de API
const proveedoresAPI = {
  // Obtener todos los proveedores
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/proveedores`, {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Error al obtener proveedores');
      }
    } catch (error) {
      console.error('Error en getAll:', error);
      throw error;
    }
  },

  // Crear nuevo proveedor
  create: async (proveedorData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/proveedores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(proveedorData)
      });
      const data = await response.json();
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Error al crear proveedor');
      }
    } catch (error) {
      console.error('Error en create:', error);
      throw error;
    }
  },

  // Actualizar proveedor
  update: async (id, proveedorData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/proveedores/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(proveedorData)
      });
      const data = await response.json();
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Error al actualizar proveedor');
      }
    } catch (error) {
      console.error('Error en update:', error);
      throw error;
    }
  },

  // Eliminar proveedor
  delete: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/proveedores/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        return true;
      } else {
        throw new Error(data.message || 'Error al eliminar proveedor');
      }
    } catch (error) {
      console.error('Error en delete:', error);
      throw error;
    }
  }
};

export default function Providers() {
  const [empleados, setEmpleados] = useState([]);
  const [activo, setActivo] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    imgProvedor: "",
    productosBrindados: [],
    numero: "",
    direccion: "",
    activo: true
  });
  
  const [errores, setErrores] = useState({});
  const panelDerechoRef = useRef(null);

  // Cargar proveedores al montar el componente
  useEffect(() => {
    cargarProveedores();
  }, []);

  const cargarProveedores = async () => {
    try {
      setLoading(true);
      setError(null);
      const proveedores = await proveedoresAPI.getAll();
      setEmpleados(proveedores);
    } catch (error) {
      setError('Error al cargar proveedores: ' + error.message);
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Efecto para manejar clicks fuera del panel
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
      correo: "",
      imgProvedor: "",
      productosBrindados: [],
      numero: "",
      direccion: "",
      activo: true
    });
    setErrores({});
  }

  function editarEmpleado() {
    if (!activo) return;
    setFormData({
      nombre: activo.nombre || "",
      correo: activo.correo || "",
      imgProvedor: activo.imgProvedor || "",
      productosBrindados: activo.productosBrindados || [],
      numero: activo.numero || "",
      direccion: activo.direccion || "",
      activo: activo.activo !== undefined ? activo.activo : true
    });
    setModoEdicion(true);
    setErrores({});
  }

  function validar() {
    const errs = {};
    if (!formData.nombre.trim()) errs.nombre = "Nombre requerido";
    if (!formData.correo.trim()) errs.correo = "Email requerido";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo))
      errs.correo = "Email inválido";
    if (!formData.numero.trim()) errs.numero = "Número requerido";
    return errs;
  }

  async function guardarEmpleado(e) {
    e.preventDefault();

    const errs = validar();
    if (Object.keys(errs).length > 0) {
      setErrores(errs);
      return;
    }

    try {
      setLoading(true);
      
      if (activo) {
        // Actualizar proveedor existente
        const actualizado = await proveedoresAPI.update(activo._id, formData);
        const nuevos = empleados.map(emp =>
          emp._id === activo._id ? actualizado : emp
        );
        setEmpleados(nuevos);
        setActivo(actualizado);
      } else {
        // Crear nuevo proveedor
        const nuevo = await proveedoresAPI.create(formData);
        setEmpleados([...empleados, nuevo]);
        setActivo(nuevo);
      }

      setModoEdicion(false);
      setErrores({});
    } catch (error) {
      setError('Error al guardar: ' + error.message);
      console.error('Error al guardar:', error);
    } finally {
      setLoading(false);
    }
  }

  function cancelar() {
    setModoEdicion(false);
    setErrores({});
    setActivo(null);
  }

  async function eliminarEmpleado() {
    if (!activo) return;
    if (window.confirm(`¿Eliminar proveedor ${activo.nombre}?`)) {
      try {
        setLoading(true);
        await proveedoresAPI.delete(activo._id);
        setEmpleados(empleados.filter(emp => emp._id !== activo._id));
        setActivo(null);
        setModoEdicion(false);
        setErrores({});
      } catch (error) {
        setError('Error al eliminar: ' + error.message);
        console.error('Error al eliminar:', error);
      } finally {
        setLoading(false);
      }
    }
  }

  // Manejo archivo de imagen para subir desde dispositivo
  function manejarArchivoImagen(e) {
    const archivo = e.target.files[0];
    if (archivo) {
      const urlLocal = URL.createObjectURL(archivo);
      setFormData(prev => ({ ...prev, imgProvedor: urlLocal }));
    }
  }

  if (loading && empleados.length === 0) {
    return (
      <div className="dashboard">
        <Sidebar />
        <main className="main">
          <h1 className="titulo">Proveedores</h1>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            Cargando proveedores...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="main">
        <h1 className="titulo">Proveedores</h1>

        {error && (
          <div style={{ 
            background: '#fee', 
            color: '#c33', 
            padding: '10px', 
            borderRadius: '5px', 
            marginBottom: '20px' 
          }}>
            {error}
            <button 
              onClick={() => setError(null)}
              style={{ float: 'right', background: 'none', border: 'none', color: '#c33' }}
            >
              ✕
            </button>
          </div>
        )}

        <div className={`contenedor${!activo && !modoEdicion ? " sin-seleccion" : ""}`}>
          <div className="panel-izquierdo">
            {empleados.map(emp => (
              <EmpleadoCard 
                key={emp._id} 
                empleado={{
                  ...emp,
                  id: emp._id, // Para compatibilidad con el componente
                  email: emp.correo,
                  foto: emp.imgProvedor || "/default.jpg",
                  titulo: emp.productosBrindados?.[0] || "Proveedor",
                  descripcion: emp.direccion || "Sin descripción"
                }} 
                onSelect={seleccionarEmpleado} 
              />
            ))}

            <button className="btn-agregar" onClick={agregarNuevo} disabled={loading}>
              {loading ? "Cargando..." : "+ Agregar nuevo proveedor"}
            </button>
          </div>

          <div className="panel-derecho" ref={panelDerechoRef}>
            {!activo && !modoEdicion && <p>Selecciona un proveedor o agrega uno nuevo.</p>}

            {activo && !modoEdicion && (
              <>
                <img 
                  src={activo.imgProvedor || "/default.jpg"} 
                  alt={activo.nombre} 
                  className="avatar-grande" 
                />
                <h2>{activo.nombre}</h2>
                <p className="subtitulo">
                  {activo.productosBrindados?.[0] || "Proveedor"}
                </p>
                <p><strong>Productos:</strong> {activo.productosBrindados?.join(", ") || "Ninguno"}</p>
                <p><strong>Número:</strong> {activo.numero}</p>
                <p><strong>Dirección:</strong> {activo.direccion || "No especificada"}</p>
                <p><strong>Email:</strong> {activo.correo}</p>
                <p><strong>Estado:</strong> {activo.activo ? "Activo" : "Inactivo"}</p>

                <div className="botones-derecha">
                  <button onClick={editarEmpleado} className="btn-editar" disabled={loading}>
                    Editar
                  </button>
                  <button onClick={eliminarEmpleado} className="btn-eliminar" disabled={loading}>
                    Eliminar
                  </button>
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
                    disabled={loading}
                  />
                  {errores.nombre && <span className="error">{errores.nombre}</span>}
                </label>

                <label>
                  Email:
                  <input
                    type="email"
                    value={formData.correo}
                    onChange={e => setFormData({ ...formData, correo: e.target.value })}
                    disabled={loading}
                  />
                  {errores.correo && <span className="error">{errores.correo}</span>}
                </label>

                <label>
                  Número:
                  <input
                    type="text"
                    value={formData.numero}
                    onChange={e => setFormData({ ...formData, numero: e.target.value })}
                    disabled={loading}
                  />
                  {errores.numero && <span className="error">{errores.numero}</span>}
                </label>

                <label>
                  Dirección:
                  <input
                    type="text"
                    value={formData.direccion}
                    onChange={e => setFormData({ ...formData, direccion: e.target.value })}
                    disabled={loading}
                  />
                </label>

                <label>
                  Foto:
                  <input
                    type="file"
                    accept="image/*"
                    onChange={manejarArchivoImagen}
                    disabled={loading}
                  />
                </label>

                {formData.imgProvedor && (
                  <img
                    src={formData.imgProvedor}
                    alt="Preview"
                    style={{ 
                      width: "100px", 
                      height: "100px", 
                      objectFit: "cover", 
                      marginTop: "10px", 
                      borderRadius: "8px" 
                    }}
                  />
                )}

                <label>
                  Estado:
                  <select
                    value={formData.activo}
                    onChange={e => setFormData({ ...formData, activo: e.target.value === 'true' })}
                    disabled={loading}
                  >
                    <option value={true}>Activo</option>
                    <option value={false}>Inactivo</option>
                  </select>
                </label>

                <div className="botones-formulario">
                  <button type="submit" className="btn-guardar" disabled={loading}>
                    {loading ? "Guardando..." : "Guardar"}
                  </button>
                  <button type="button" onClick={cancelar} className="btn-cancelar" disabled={loading}>
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}