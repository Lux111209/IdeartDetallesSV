// src/pages/Providers.jsx
import { useState, useEffect, useRef } from "react";
import EmpleadoCard from "../components/providersCart";
import Sidebar from "../components/Sidebar"; 
import "../css/providers.css";

// URL base para las peticiones a la API
const API_BASE_URL = "https://ideartdetallessv-1.onrender.com/api";

// Objeto con todas las funciones para interactuar con la API de proveedores
const proveedoresAPI = {
  // Obtener todos los proveedores desde el servidor
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

  // Crear un nuevo proveedor en el servidor
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

  // Actualizar un proveedor existente
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

  // Eliminar un proveedor del servidor
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
  // Estados principales del componente
  const [empleados, setEmpleados] = useState([]); // Lista de proveedores
  const [activo, setActivo] = useState(null); // Proveedor seleccionado actualmente
  const [modoEdicion, setModoEdicion] = useState(false); // Si está en modo edición/creación
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Mensajes de error
  
  // Estado del formulario para crear/editar proveedores
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    imgProvedor: "",
    productosBrindados: [],
    numero: "",
    direccion: "",
    activo: true
  });
  
  // Estados para validación y manejo de imágenes
  const [errores, setErrores] = useState({}); // Errores de validación del formulario
  const [imagenPreview, setImagenPreview] = useState(""); // Preview de imagen seleccionada
  const panelDerechoRef = useRef(null); // Referencia al panel derecho para detectar clicks

  // Cargar la lista de proveedores cuando se monta el componente
  useEffect(() => {
    cargarProveedores();
  }, []);

  // Función para obtener todos los proveedores desde la API
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

  // Detectar clicks fuera del panel derecho para cerrar la edición
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
          setImagenPreview("");
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activo, modoEdicion]);

  // Seleccionar un proveedor para ver sus detalles
  function seleccionarEmpleado(emp) {
    setActivo(emp);
    setModoEdicion(false);
    setErrores({});
    setImagenPreview("");
  }

  // Iniciar el modo de creación de un nuevo proveedor
  function agregarNuevo() {
    setActivo(null);
    setModoEdicion(true);
    // Resetear el formulario con valores por defecto
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
    setImagenPreview("");
  }

  // Iniciar el modo de edición para el proveedor seleccionado
  function editarEmpleado() {
    if (!activo) return;
    // Llenar el formulario con los datos del proveedor actual
    setFormData({
      nombre: activo.nombre || "",
      correo: activo.correo || "",
      imgProvedor: activo.imgProvedor || "",
      productosBrindados: activo.productosBrindados || [],
      numero: activo.numero || "",
      direccion: activo.direccion || "",
      activo: activo.activo !== undefined ? activo.activo : true
    });
    setImagenPreview(activo.imgProvedor || "");
    setModoEdicion(true);
    setErrores({});
  }

  // Validar los datos del formulario antes de guardar
  function validar() {
    const errs = {};
    if (!formData.nombre.trim()) errs.nombre = "Nombre requerido";
    if (!formData.correo.trim()) errs.correo = "Email requerido";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo))
      errs.correo = "Email inválido";
    if (!formData.numero.trim()) errs.numero = "Número requerido";
    return errs;
  }

  // Guardar el proveedor (crear nuevo o actualizar existente)
  async function guardarEmpleado(e) {
    e.preventDefault();

    // Validar los datos antes de enviar
    const errs = validar();
    if (Object.keys(errs).length > 0) {
      setErrores(errs);
      return;
    }

    try {
      setLoading(true);
      
      // Preparar los datos para enviar a la API
      const datosParaGuardar = {
        ...formData,
        imgProvedor: imagenPreview || formData.imgProvedor
      };
      
      if (activo) {
        // Actualizar proveedor existente
        const actualizado = await proveedoresAPI.update(activo._id, datosParaGuardar);
        const nuevos = empleados.map(emp =>
          emp._id === activo._id ? actualizado : emp
        );
        setEmpleados(nuevos);
        setActivo(actualizado);
      } else {
        // Crear nuevo proveedor
        const nuevo = await proveedoresAPI.create(datosParaGuardar);
        setEmpleados([...empleados, nuevo]);
        setActivo(nuevo);
      }

      // Salir del modo edición y limpiar errores
      setModoEdicion(false);
      setErrores({});
      setImagenPreview("");
    } catch (error) {
      setError('Error al guardar: ' + error.message);
      console.error('Error al guardar:', error);
    } finally {
      setLoading(false);
    }
  }

  // Cancelar la edición y volver al estado anterior
  function cancelar() {
    setModoEdicion(false);
    setErrores({});
    setActivo(null);
    setImagenPreview("");
  }

  // Eliminar el proveedor seleccionado
  async function eliminarEmpleado() {
    if (!activo) return;
    // Confirmar antes de eliminar
    if (window.confirm(`¿Eliminar proveedor ${activo.nombre}?`)) {
      try {
        setLoading(true);
        await proveedoresAPI.delete(activo._id);
        // Remover de la lista local
        setEmpleados(empleados.filter(emp => emp._id !== activo._id));
        setActivo(null);
        setModoEdicion(false);
        setErrores({});
        setImagenPreview("");
      } catch (error) {
        setError('Error al eliminar: ' + error.message);
        console.error('Error al eliminar:', error);
      } finally {
        setLoading(false);
      }
    }
  }

  // Convertir un archivo de imagen a formato Base64
  const convertirArchivoABase64 = (archivo) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(archivo);
    });
  };

  // Manejar la selección de una nueva imagen desde el dispositivo
  async function manejarArchivoImagen(e) {
    const archivo = e.target.files[0];
    if (archivo) {
      try {
        // Validar que sea un archivo de imagen
        if (!archivo.type.startsWith('image/')) {
          setError('Por favor selecciona un archivo de imagen válido');
          return;
        }

        // Validar el tamaño del archivo (máximo 5MB)
        if (archivo.size > 5 * 1024 * 1024) {
          setError('La imagen debe ser menor a 5MB');
          return;
        }

        // Convertir la imagen a base64 para mostrar preview
        const base64 = await convertirArchivoABase64(archivo);
        setImagenPreview(base64);
        setFormData(prev => ({ ...prev, imgProvedor: base64 }));
        setError(null);
      } catch (error) {
        console.error('Error al procesar imagen:', error);
        setError('Error al procesar la imagen');
      }
    }
  }

  // Mostrar pantalla de carga mientras se obtienen los datos iniciales
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

        {/* Mostrar mensajes de error si existen */}
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
          
          {/* Panel izquierdo - Lista de proveedores */}
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

            {/* Botón para agregar nuevo proveedor */}
            <button className="btn-agregar" onClick={agregarNuevo} disabled={loading}>
              {loading ? "Cargando..." : "+ Agregar nuevo proveedor"}
            </button>
          </div>

          {/* Panel derecho - Detalles y formulario */}
          <div className="panel-derecho" ref={panelDerechoRef}>
            
            {/* Mensaje cuando no hay nada seleccionado */}
            {!activo && !modoEdicion && <p>Selecciona un proveedor o agrega uno nuevo.</p>}

            {/* Vista de detalles del proveedor seleccionado */}
            {activo && !modoEdicion && (
              <>
                <img 
                  src={activo.imgProvedor || "/default.jpg"} 
                  alt={activo.nombre} 
                  className="avatar-grande"
                  onError={(e) => {
                    e.target.src = "/default.jpg";
                  }}
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

                {/* Botones de acción para el proveedor seleccionado */}
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

            {/* Formulario de edición/creación */}
            {modoEdicion && (
              <form onSubmit={guardarEmpleado} className="formulario" noValidate>
                
                {/* Campo de nombre */}
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

                {/* Campo de email */}
                // Campo de correo electrónico
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

                {/* Campo de número de teléfono */}
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

                {/* Campo de dirección */}
                <label>
                  Dirección:
                  <input
                    type="text"
                    value={formData.direccion}
                    onChange={e => setFormData({ ...formData, direccion: e.target.value })}
                    disabled={loading}
                  />
                </label>

                {/* Campo para subir imagen */}
                <label>
                  Foto:
                  <input
                    type="file"
                    accept="image/*"
                    onChange={manejarArchivoImagen}
                    disabled={loading}
                  />
                  <small style={{ color: '#666', fontSize: '12px' }}>
                    Formatos permitidos: JPG, PNG, GIF. Máximo 5MB.
                  </small>
                </label>

                {/* Preview de la imagen seleccionada */}
                {(imagenPreview || formData.imgProvedor) && (
                  <div style={{ marginTop: '10px' }}>
                    <img
                      src={imagenPreview || formData.imgProvedor}
                      alt="Preview"
                      style={{ 
                        width: "100px", 
                        height: "100px", 
                        objectFit: "cover", 
                        borderRadius: "8px",
                        border: "2px solid #ddd"
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    {/* Botón para quitar la imagen */}
                    {imagenPreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setImagenPreview("");
                          setFormData(prev => ({ ...prev, imgProvedor: "" }));
                        }}
                        style={{
                          marginLeft: '10px',
                          padding: '5px 10px',
                          background: '#f44336',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                        disabled={loading}
                      >
                        Quitar imagen
                      </button>
                    )}
                  </div>
                )}

                {/* Campo de estado (activo/inactivo) */}
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

                {/* Botones del formulario */}
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