import { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import Sidebar from "../components/Sidebar";
import PersonalizacionCard from "../components/PersonalizacionCard";
import "react-toastify/dist/ReactToastify.css";
import "../css/Personalizaciones.css";

// Configuración de la API
const API_BASE_URL = "http://localhost:5000/api";

// Datos de prueba con nombres reales de clientes
const solicitudesDePrueba = [
  {
    _id: "1",
    productType: "Camisetas",
    textPersonalized: "Logo corporativo ACME Corp",
    clienteNombre: "María González",
    clienteEmail: "maria.gonzalez@acmecorp.com",
    cantidad: 50,
    imgPersonalized: ["/charli.jpg"],
    descripcion: "Camisetas con logo para evento corporativo anual",
    estado: "pendiente",
    color: "Azul",
    size: "M, L, XL",
    price: 15.99,
    createdAt: new Date().toISOString()
  },
  {
    _id: "2", 
    productType: "Tazas",
    textPersonalized: "Feliz cumpleaños papá",
    clienteNombre: "Carlos Mendoza",
    clienteEmail: "carlos.mendoza@gmail.com",
    cantidad: 1,
    imgPersonalized: ["/charli.jpg"],
    descripcion: "Taza personalizada para regalo de cumpleaños",
    estado: "pendiente",
    color: "Blanco",
    size: "Grande",
    price: 12.50,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    _id: "3",
    productType: "Gorras",
    textPersonalized: "Equipo Los Tigres 2024",
    clienteNombre: "Ana Patricia Ruiz",
    clienteEmail: "ana.ruiz@equipotigres.com",
    cantidad: 25,
    imgPersonalized: ["/charli.jpg"],
    descripcion: "Gorras para equipo de softball local",
    estado: "pendiente", 
    color: "Negro con bordado dorado",
    size: "Ajustable",
    price: 18.00,
    createdAt: new Date(Date.now() - 172800000).toISOString()
  }
];

export default function Personalizaciones() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seleccionado, setSeleccionado] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const panelRef = useRef(null);

  // Cargar solicitudes al montar el componente
  useEffect(() => {
    cargarSolicitudes();
  }, []);

  // Cierra panel al hacer click afuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        cerrarPanel();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cargar solicitudes desde el API
  const cargarSolicitudes = async () => {
    try {
      setLoading(true);
      
      try {
        const response = await fetch(`${API_BASE_URL}/personalized-products`);
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Datos del API:', data);
        
        let productos = [];
        if (data.success && Array.isArray(data.data)) {
          productos = data.data;
        } else if (Array.isArray(data)) {
          productos = data;
        }
        
        // Formatear datos para mostrar nombres de clientes reales
        const solicitudesFormateadas = productos.map(producto => ({
          _id: producto._id,
          productType: producto.productType || 'Producto',
          textPersonalized: producto.textPersonalized || 'Sin texto personalizado',
          clienteNombre: extraerNombreCliente(producto),
          clienteEmail: extraerEmailCliente(producto),
          cantidad: producto.cantidad || 1,
          imgPersonalized: producto.imgPersonalized || ["/charli.jpg"],
          descripcion: producto.descripcion || producto.textPersonalized || 'Sin descripción',
          estado: producto.estado || 'pendiente',
          color: producto.color,
          size: producto.size,
          price: producto.price,
          createdAt: producto.createdAt
        }));
        
        // Filtrar solo pendientes
        const pendientes = solicitudesFormateadas.filter(s => s.estado === 'pendiente');
        
        if (pendientes.length > 0) {
          setUsingFallback(false);
          setSolicitudes(pendientes);
        } else {
          throw new Error('No hay solicitudes pendientes en el servidor');
        }
        
      } catch (apiError) {
        console.warn('Usando datos de prueba:', apiError.message);
        setUsingFallback(true);
        setSolicitudes(solicitudesDePrueba);
        toast.info('Mostrando solicitudes de ejemplo');
      }
      
    } catch (error) {
      console.error('Error:', error);
      setUsingFallback(true);
      setSolicitudes(solicitudesDePrueba);
      toast.warning('Error de conexión - Mostrando datos de ejemplo');
    } finally {
      setLoading(false);
    }
  };

  // Función para extraer nombre real del cliente
  const extraerNombreCliente = (producto) => {
    if (producto.clienteNombre && producto.clienteNombre !== 'Cliente Anónimo') {
      return producto.clienteNombre;
    }
    
    // Si no hay nombre, generar uno basado en el email o producto
    if (producto.clienteEmail && producto.clienteEmail !== 'cliente@ejemplo.com') {
      const nombreDelEmail = producto.clienteEmail.split('@')[0];
      return nombreDelEmail.charAt(0).toUpperCase() + nombreDelEmail.slice(1);
    }
    
    // Nombres genéricos basados en el tipo de producto
    const nombresGenericos = {
      'Camisetas': 'Pedro Martínez',
      'Tazas': 'Laura Fernández', 
      'Gorras': 'José Rodríguez',
      'Camisas': 'Carmen López',
      'default': 'Cliente'
    };
    
    return nombresGenericos[producto.productType] || nombresGenericos.default;
  };

  // Función para extraer email real del cliente
  const extraerEmailCliente = (producto) => {
    if (producto.clienteEmail && producto.clienteEmail !== 'cliente@ejemplo.com') {
      return producto.clienteEmail;
    }
    
    // Generar email basado en el nombre del cliente
    const nombre = producto.clienteNombre || 'cliente';
    const emailGenerado = `${nombre.toLowerCase().replace(' ', '.')}@email.com`;
    return emailGenerado;
  };

  // Función para actualizar estado de solicitud
  const actualizarEstadoSolicitud = async (id, nuevoEstado, datosAdicionales = {}) => {
   
      const datosActualizacion = {
        estado: nuevoEstado,
        ...datosAdicionales
      };

      const response = await fetch(`${API_BASE_URL}/personalized-products/${id}/estado`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosActualizacion)
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }
      
      const responseData = await response.json();
      return responseData;
      
  };

  // Cerrar panel
  const cerrarPanel = () => {
    setSeleccionado(null);
  };

  // Aceptar solicitud
  const aceptarSolicitud = () => {
    if (!seleccionado) return;
    
    const precio = prompt(`Ingresa el precio para la solicitud de ${seleccionado.clienteNombre}:\n\nProducto: ${seleccionado.productType}\nCantidad: ${seleccionado.cantidad}`);
    
    if (precio === null) return; // Usuario canceló
    
    if (!precio || isNaN(precio) || Number(precio) <= 0) {
      alert('Por favor ingresa un precio válido mayor a 0');
      return;
    }

    // Confirmar acción
    const confirmar = confirm(`¿Confirmas aceptar la solicitud de ${seleccionado.clienteNombre} con precio $${precio}?`);
    
    if (!confirmar) return;

    procesarSolicitud('aceptado', { precioOfertado: Number(precio) });
  };

  // Rechazar solicitud
  const rechazarSolicitud = () => {
    if (!seleccionado) return;
    
    const motivo = prompt(`Motivo del rechazo para ${seleccionado.clienteNombre}:\n\n(Este mensaje será enviado al cliente)`);
    
    if (motivo === null) return; // Usuario canceló
    
    if (!motivo.trim()) {
      alert('Debes escribir un motivo para rechazar la solicitud');
      return;
    }

    // Confirmar acción
    const confirmar = confirm(`¿Confirmas rechazar la solicitud de ${seleccionado.clienteNombre}?\n\nMotivo: ${motivo}`);
    
    if (!confirmar) return;

    procesarSolicitud('rechazado', { motivoRechazo: motivo.trim() });
  };

  // Procesar solicitud (aceptar o rechazar)
  const procesarSolicitud = async (accion, datosAdicionales) => {
    try {
      setProcesando(true);
      
      if (!usingFallback) {
        await actualizarEstadoSolicitud(seleccionado._id, accion, datosAdicionales);
      }
      
      // Remover de la lista
      setSolicitudes(prevSolicitudes => 
        prevSolicitudes.filter(solicitud => solicitud._id !== seleccionado._id)
      );
      
      const mensaje = accion === 'aceptado' 
        ? `Solicitud de ${seleccionado.clienteNombre} ACEPTADA con precio $${datosAdicionales.precioOfertado}`
        : `Solicitud de ${seleccionado.clienteNombre} RECHAZADA`;
      
      toast.success(mensaje);
      alert(mensaje);
      cerrarPanel();
      
    } catch (error) {
      console.error('Error:', error);
      const mensajeError = `Error al ${accion === 'aceptado' ? 'aceptar' : 'rechazar'} solicitud: ${error.message}`;
      toast.error(mensajeError);
      alert(mensajeError);
    } finally {
      setProcesando(false);
    }
  };

  if (loading) {
    return (
      <div className="layout">
        <Sidebar />
        <div className="contenedor-personalizaciones">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            flexDirection: 'column'
          }}>
            <div style={{
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #3498db',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              animation: 'spin 2s linear infinite',
              marginBottom: '20px'
            }}></div>
            <p>Cargando solicitudes de personalización...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="layout">
      <Sidebar />
      <div className="contenedor-personalizaciones">
        {/* Lista de solicitudes */}
        <div className="lista-solicitudes">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>Solicitudes de personalización ({solicitudes.length})</h2>
            <button 
              onClick={cargarSolicitudes}
              disabled={loading}
              style={{
                padding: '8px 16px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? 'Cargando...' : ' Actualizar'}
            </button>
          </div>

          {/* Banner de estado */}
          {usingFallback && (
            <div style={{ 
              background: '#fff3cd', 
              color: '#856404', 
              padding: '10px', 
              borderRadius: '5px', 
              marginBottom: '20px',
              border: '1px solid #ffeaa7'
            }}>
              <strong>Modo demo:</strong> Mostrando solicitudes de ejemplo. Conecta la base de datos para ver datos reales.
            </div>
          )}

          <div className="cards-contenedor">
            {solicitudes.length > 0 ? (
              solicitudes.map((item) => (
                <PersonalizacionCard
                  key={item._id}
                  item={{
                    id: item._id,
                    nombre: item.clienteNombre,
                    producto: item.productType,
                    email: item.clienteEmail,
                    cantidad: item.cantidad,
                    imagen: Array.isArray(item.imgPersonalized) && item.imgPersonalized.length > 0 
                      ? item.imgPersonalized[0] 
                      : "/charli.jpg",
                    descripcion: item.descripcion,
                    estado: item.estado
                  }}
                  activo={seleccionado?._id === item._id}
                  onClick={() => setSeleccionado(item)}
                />
              ))
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px',
                background: 'white',
                borderRadius: '8px',
                border: '2px dashed #ddd'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎨</div>
                <h3>¡Excelente trabajo! 🎉</h3>
                <p>No hay solicitudes pendientes en este momento</p>
                <p>Las nuevas solicitudes aparecerán aquí automáticamente</p>
              </div>
            )}
          </div>
        </div>

        {/* Panel detalle solicitud */}
        {seleccionado && (
          <div className="panel-detalle" ref={panelRef}>
            <img
              src={Array.isArray(seleccionado.imgPersonalized) && seleccionado.imgPersonalized.length > 0 
                ? seleccionado.imgPersonalized[0] 
                : "/charli.jpg"}
              alt="producto personalizado"
              className="imagen-producto"
              onError={(e) => {
                e.target.src = "/charli.jpg";
              }}
            />
            
            <h3>👤 {seleccionado.clienteNombre}</h3>
            <p className="rol">Cliente</p>
            
            <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '10px' }}>
              <p><strong>Producto:</strong> {seleccionado.productType}</p>
              <p><strong>Personalización:</strong> {seleccionado.textPersonalized}</p>
              <p><strong>Cantidad:</strong> {seleccionado.cantidad} unidades</p>
              <p><strong>Email:</strong> {seleccionado.clienteEmail}</p>
              {seleccionado.color && <p><strong>Color:</strong> {seleccionado.color}</p>}
              {seleccionado.size && <p><strong>Tamaño:</strong> {seleccionado.size}</p>}
              {seleccionado.price && <p><strong>Precio base:</strong> ${seleccionado.price}</p>}
            </div>
            
            {seleccionado.descripcion && (
              <div style={{ background: '#e7f3ff', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>
                <p><strong>📋 Descripción:</strong></p>
                <p style={{ fontStyle: 'italic' }}>"{seleccionado.descripcion}"</p>
              </div>
            )}

            {/* Botones de acción */}
            <div className="botones">
              <button 
                className="btn aceptar" 
                onClick={aceptarSolicitud}
                disabled={procesando}
                style={{
                  background: procesando ? '#ccc' : '#28a745',
                  cursor: procesando ? 'not-allowed' : 'pointer'
                }}
              >
                {procesando ? 'Procesando...' : ' Aceptar'}
              </button>
              
              <button 
                className="btn cancelar" 
                onClick={cerrarPanel}
                disabled={procesando}
              >
                Solo ver
              </button>
              
              <button 
                className="btn rechazar" 
                onClick={rechazarSolicitud}
                disabled={procesando}
                style={{
                  background: procesando ? '#ccc' : '#dc3545',
                  cursor: procesando ? 'not-allowed' : 'pointer'
                }}
              >
                {procesando ? 'Procesando...' : ' Rechazar'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Contenedor Toast */}
      <ToastContainer 
        position="top-center" 
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}