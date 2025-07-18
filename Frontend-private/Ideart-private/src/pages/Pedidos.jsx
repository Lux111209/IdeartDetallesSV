import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import DetallePedido from "../components/DetallePedido";
import "react-toastify/dist/ReactToastify.css";
import "../css/Pedidos.css";

// Configuración de la API
const API_BASE_URL = "http://localhost:5000/api";

// Datos de prueba para cuando el API no esté disponible
const pedidosDePrueba = [
  {
    id: "1",
    clienteNombre: "Juan Pérez",
    clienteEmail: "juan@email.com",
    fecha: new Date().toLocaleDateString(),
    total: 150.50,
    estado: "pendiente",
    estadoPago: "pendiente",
    metodoPago: "tarjeta_credito",
    direccion: "Calle Principal 123, San Salvador",
    productos: [
      {
        nombre: "Producto A",
        cantidad: 2,
        precio: 50.25,
        imagen: "https://via.placeholder.com/80x80"
      },
      {
        nombre: "Producto B",
        cantidad: 1,
        precio: 50.00,
        imagen: "https://via.placeholder.com/80x80"
      }
    ]
  },
  {
    id: "2",
    clienteNombre: "María García",
    clienteEmail: "maria@email.com",
    fecha: new Date(Date.now() - 86400000).toLocaleDateString(),
    total: 89.99,
    estado: "completado",
    estadoPago: "pagado",
    metodoPago: "efectivo",
    direccion: "Avenida Central 456, San Salvador",
    productos: [
      {
        nombre: "Producto C",
        cantidad: 1,
        precio: 89.99,
        imagen: "https://via.placeholder.com/80x80"
      }
    ]
  }
];

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seleccionado, setSeleccionado] = useState(null);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [accionPendiente, setAccionPendiente] = useState("");
  const [usingFallback, setUsingFallback] = useState(false);
  
  // Ref para la tarjeta activa
  const cardRef = useRef(null);

  useEffect(() => {
    cargarPedidos();

    // Función para manejar clics fuera de la tarjeta
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        cerrarPanel();
      }
    };

    // Agregar el event listener
    document.addEventListener("mousedown", handleClickOutside);
    
    // Limpiar el event listener al desmontar el componente
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [seleccionado]); // Dependencia en seleccionado para actualizar el listener

  const cargarPedidos = async () => {
    try {
      setLoading(true);
      setError(null);

      // Intentar cargar desde el API
      try {
        const response = await fetch(`${API_BASE_URL}/ventas`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const ventasData = await response.json();
        console.log('Datos de ventas recibidos:', ventasData);
        
        // Manejar respuesta del API
        let ventas = [];
        if (Array.isArray(ventasData)) {
          ventas = ventasData;
        } else if (ventasData.success && Array.isArray(ventasData.data)) {
          ventas = ventasData.data;
        } else {
          throw new Error('Formato de respuesta no válido');
        }
        
        // Si llegamos aquí, el API funciona
        setUsingFallback(false);
        
        // Transformar datos de ventas a formato de pedidos
        const pedidosFormateados = ventas.map(venta => ({
          id: venta._id,
          clienteNombre: venta.idShoppingCart?.usuario?.nombre || 'Cliente Anónimo',
          clienteEmail: venta.idShoppingCart?.usuario?.email || 'sin-email@ejemplo.com',
          fecha: new Date(venta.createdAt || Date.now()).toLocaleDateString(),
          total: venta.idShoppingCart?.total || 0,
          estado: venta.statusTransaccion || 'pendiente',
          estadoPago: venta.statusPago || 'pendiente',
          metodoPago: venta.metodoPago || 'no especificado',
          direccion: venta.direction || 'Dirección no especificada',
          productos: venta.idShoppingCart?.productos?.map(item => ({
            nombre: item.producto?.name || item.name || 'Producto sin nombre',
            cantidad: item.cantidad || 1,
            precio: item.producto?.price || item.precio || 0,
            imagen: item.producto?.images?.[0] || item.imagen || 'https://via.placeholder.com/80x80'
          })) || [],
          ventaOriginal: venta
        }));

        setPedidos(pedidosFormateados);
        
      } catch (apiError) {
        console.warn('API no disponible, usando datos de prueba:', apiError.message);
        
        // Usar datos de prueba
        setUsingFallback(true);
        setPedidos(pedidosDePrueba);
        
        setError(`API no disponible (${apiError.message}). Mostrando datos de prueba.`);
      }
      
    } catch (error) {
      setError('Error general: ' + error.message);
      console.error('Error:', error);
      
      // Como último recurso, usar datos de prueba
      setUsingFallback(true);
      setPedidos(pedidosDePrueba);
      
    } finally {
      setLoading(false);
    }
  };

  const cerrarPanel = () => {
    setSeleccionado(null);
    setMostrarConfirmacion(false);
    setAccionPendiente("");
  };

  const completarPedido = async () => {
    if (!seleccionado) return;

    try {
      setLoading(true);
      
      if (!usingFallback) {
        // Intentar actualizar en el API
        const response = await fetch(`${API_BASE_URL}/ventas/${seleccionado.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ statusTransaccion: 'completado' })
        });
        
        if (!response.ok) {
          throw new Error('Error en el servidor');
        }
      }
      
      // Actualizar estado local
      setPedidos(prevPedidos => 
        prevPedidos.map(pedido => 
          pedido.id === seleccionado.id 
            ? { ...pedido, estado: 'completado' }
            : pedido
        )
      );

      setSeleccionado(prev => ({ ...prev, estado: 'completado' }));
      toast.success("✅ Pedido marcado como completado");
      cerrarPanel();
      
    } catch (error) {
      console.error('Error completando pedido:', error);
      toast.error('Error al completar pedido: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelarPedido = async () => {
    if (!seleccionado) return;

    try {
      setLoading(true);
      
      if (!usingFallback) {
        // Intentar actualizar en el API
        const response = await fetch(`${API_BASE_URL}/ventas/${seleccionado.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ statusTransaccion: 'cancelado' })
        });
        
        if (!response.ok) {
          throw new Error('Error en el servidor');
        }
      }
      
      // Actualizar estado local
      setPedidos(prevPedidos => 
        prevPedidos.map(pedido => 
          pedido.id === seleccionado.id 
            ? { ...pedido, estado: 'cancelado' }
            : pedido
        )
      );

      setSeleccionado(prev => ({ ...prev, estado: 'cancelado' }));
      toast.info("❌ Pedido cancelado");
      cerrarPanel();
      
    } catch (error) {
      console.error('Error cancelando pedido:', error);
      toast.error('Error al cancelar pedido: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const marcarComoPagado = async () => {
    if (!seleccionado) return;

    try {
      setLoading(true);
      
      if (!usingFallback) {
        // Intentar actualizar en el API
        const response = await fetch(`${API_BASE_URL}/ventas/${seleccionado.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ statusPago: 'pagado' })
        });
        
        if (!response.ok) {
          throw new Error('Error en el servidor');
        }
      }
      
      // Actualizar estado local
      setPedidos(prevPedidos => 
        prevPedidos.map(pedido => 
          pedido.id === seleccionado.id 
            ? { ...pedido, estadoPago: 'pagado' }
            : pedido
        )
      );

      setSeleccionado(prev => ({ ...prev, estadoPago: 'pagado' }));
      toast.success("💰 Pago confirmado");
      
    } catch (error) {
      console.error('Error marcando como pagado:', error);
      toast.error('Error al confirmar pago: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const abrirConfirmacion = (accion) => {
    setAccionPendiente(accion);
    setMostrarConfirmacion(true);
  };

  const confirmarAccion = async () => {
    if (accionPendiente === "descargar") {
      descargarComprobante();
    } else if (accionPendiente === "completar") {
      await completarPedido();
    } else if (accionPendiente === "cancelar") {
      await cancelarPedido();
    } else if (accionPendiente === "marcar-pagado") {
      await marcarComoPagado();
    }
    setMostrarConfirmacion(false);
    setAccionPendiente("");
  };

  const descargarComprobante = () => {
    if (!seleccionado) return;

    try {
      const contenidoComprobante = `
COMPROBANTE DE PEDIDO
=====================

Pedido ID: ${seleccionado.id}
Cliente: ${seleccionado.clienteNombre}
Email: ${seleccionado.clienteEmail}
Fecha: ${seleccionado.fecha}
Dirección: ${seleccionado.direccion}

ESTADO:
- Pedido: ${seleccionado.estado}
- Pago: ${seleccionado.estadoPago}
- Método de pago: ${seleccionado.metodoPago}

PRODUCTOS:
${seleccionado.productos.map((producto, index) => `
${index + 1}. ${producto.nombre}
   Cantidad: ${producto.cantidad}
   Precio: $${producto.precio.toFixed(2)}
   Subtotal: $${(producto.precio * producto.cantidad).toFixed(2)}
`).join('')}

TOTAL: $${seleccionado.total.toFixed(2)}

${usingFallback ? '(Datos de prueba - API no disponible)' : ''}
Generado el: ${new Date().toLocaleString()}
      `.trim();

      const blob = new Blob([contenidoComprobante], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `comprobante-pedido-${seleccionado.id}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("📥 Comprobante descargado exitosamente");
    } catch (error) {
      console.error('Error descargando comprobante:', error);
      toast.error('Error al descargar comprobante');
    }
  };

  const obtenerEstadoColor = (estado) => {
    switch (estado) {
      case 'completado': return '#9C0D38'; // Color actualizado
      case 'cancelado': return '#CF5375'; // Color actualizado
      case 'en_proceso': return '#DABBF5'; // Color actualizado
      case 'pendiente': return '#DDF0FF'; // Color actualizado
      default: return '#DDF0FF'; // Color actualizado
    }
  };

  const obtenerEstadoPagoColor = (estadoPago) => {
    switch (estadoPago) {
      case 'pagado': return '#9C0D38'; // Color actualizado
      case 'pendiente': return '#DABBF5'; // Color actualizado
      case 'rechazado': return '#CF5375'; // Color actualizado
      default: return '#DDF0FF'; // Color actualizado
    }
  };

  if (loading && pedidos.length === 0) {
    return (
      <div className="layout">
        <Sidebar />
        <div className="contenedor-pedidos">
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
            <p>Cargando pedidos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="layout">
      <Sidebar />
      <div className="contenedor-pedidos">
        <div className="lista-pedidos">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>Pedidos ({pedidos.length})</h2>
            <button 
              onClick={cargarPedidos}
              disabled={loading}
              style={{
                padding: '8px 16px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {loading ? 'Cargando...' : '🔄 Actualizar'}
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
              ⚠️ <strong>Modo de prueba:</strong> API no disponible. Mostrando datos de ejemplo.
            </div>
          )}

          {/* Mostrar error si existe */}
          {error && (
            <div style={{ 
              background: '#fee', 
              color: '#c33', 
              padding: '10px', 
              borderRadius: '5px', 
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>{error}</span>
              <button 
                onClick={() => setError(null)}
                style={{ background: 'none', border: 'none', color: '#c33', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
          )}

          {/* Estadísticas rápidas */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
            gap: '10px', 
            marginBottom: '20px' 
          }}>
            <div style={{ background: '#e7f3ff', padding: '10px', borderRadius: '5px', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#0066cc' }}>
                {pedidos.filter(p => p.estado === 'pendiente').length}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>Pendientes</div>
            </div>
            <div style={{ background: '#e8f5e8', padding: '10px', borderRadius: '5px', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#9C0D38' }}>
                {pedidos.filter(p => p.estado === 'completado').length}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>Completados</div>
            </div>
            <div style={{ background: '#fff3cd', padding: '10px', borderRadius: '5px', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#DABBF5' }}>
                {pedidos.filter(p => p.estadoPago === 'pendiente').length}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>Pagos Pendientes</div>
            </div>
          </div>

          <div className="cards-contenedor">
            {pedidos.length > 0 ? (
              pedidos.map((pedido) => (
                <div
                  key={pedido.id}
                  ref={seleccionado?.id === pedido.id ? cardRef : null} // Asigna el ref a la tarjeta activa
                  className={`card-pedido ${seleccionado?.id === pedido.id ? 'activa' : ''}`}
                  onClick={() => setSeleccionado(pedido)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="info" style={{ flex: 1 }}>
                    <div className="nombre">{pedido.clienteNombre}</div>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                      Pedido #{pedido.id.toString().slice(-8)}
                    </div>
                    <div style={{ fontSize: '12px', color: '#888' }}>
                      {pedido.fecha} • ${pedido.total.toFixed(2)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <span style={{ 
                      padding: '2px 8px', 
                      borderRadius: '12px', 
                      fontSize: '11px',
                      fontWeight: 'bold',
                      color: 'white',
                      background: obtenerEstadoColor(pedido.estado)
                    }}>
                      {pedido.estado.toUpperCase()}
                    </span>
                    <span style={{ 
                      padding: '2px 8px', 
                      borderRadius: '12px', 
                      fontSize: '11px',
                      fontWeight: 'bold',
                      color: 'white',
                      background: obtenerEstadoPagoColor(pedido.estadoPago)
                    }}>
                      {pedido.estadoPago.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px',
                background: 'white',
                borderRadius: '8px',
                border: '2px dashed #ddd'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
                <h3>No hay pedidos disponibles</h3>
                <p>Los pedidos aparecerán aquí cuando se realicen ventas</p>
                {usingFallback && (
                  <p style={{ color: '#666', fontSize: '14px', marginTop: '10px' }}>
                    (Conecta el API de ventas para ver datos reales)
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {seleccionado && (
          <DetallePedido
            pedido={seleccionado}
            onCompletar={() => abrirConfirmacion("completar")}
            onCancelar={() => abrirConfirmacion("cancelar")}
            onDescargar={() => abrirConfirmacion("descargar")}
            onMarcarPagado={() => abrirConfirmacion("marcar-pagado")}
            loading={loading}
          />
        )}

        {mostrarConfirmacion && (
          <div className="popup-overlay" onClick={() => setMostrarConfirmacion(false)}>
            <div className="popup-contenido" onClick={(e) => e.stopPropagation()}>
              <h3>
                {accionPendiente === "completar" && "¿Marcar este pedido como completado?"}
                {accionPendiente === "cancelar" && "¿Cancelar este pedido?"}
                {accionPendiente === "descargar" && "¿Descargar comprobante del pedido?"}
                {accionPendiente === "marcar-pagado" && "¿Marcar este pedido como pagado?"}
              </h3>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: '20px' }}>
                <button 
                  className="btn cancelar" 
                  onClick={() => setMostrarConfirmacion(false)}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button 
                  className="btn aceptar" 
                  onClick={confirmarAccion}
                  disabled={loading}
                  style={{
                    background: '#9C0D38', // Color actualizado
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1
                  }}
                >
                  {loading ? 'Procesando...' : 'Confirmar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .popup-contenido {
          background: white;
          padding: 30px;
          border-radius: 10px;
          max-width: 400px;
          width: 90%;
        }
      `}</style>
    </div>
  );
}
