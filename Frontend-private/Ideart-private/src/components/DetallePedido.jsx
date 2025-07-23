import React from 'react';

const DetallePedido = ({ 
  pedido, 
  onCompletar, 
  onCancelar, 
  onDescargar, 
  onMarcarPagado,
  loading = false 
}) => {
  if (!pedido) return null;

  const obtenerEstadoColor = (estado) => {
    switch (estado) {
      case 'completado': return '#9C0D38'; // Color actualizado
      case 'cancelado': return '#CF5375'; // Color actualizado
      case 'en_proceso': return '#993d55ff'; // Color actualizado
      case 'pendiente': return '#af224cff'; // Color actualizado
      default: return '#DDF0FF'; // Color actualizado
    }
  };

  const obtenerEstadoPagoColor = (estadoPago) => {
    switch (estadoPago) {
      case 'pagado': return '#9C0D38'; // Color actualizado
      case 'pendiente': return '#DABBF5'; // Color actualizado
      case 'rechazado': return '#CF5375'; // Color actualizado
      default: return '#2a455aff'; // Color actualizado
    }
  };

  return (
    <div className="detalle-pedido">
      {/* Header con información del cliente */}
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '10px', 
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
          Pedido #{pedido.id.slice(-8)}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <p><strong>Cliente:</strong> {pedido.clienteNombre}</p>
            <p><strong>Email:</strong> {pedido.clienteEmail}</p>
            <p><strong>Fecha:</strong> {pedido.fecha}</p>
          </div>
          <div>
            <p><strong>Método de pago:</strong> {pedido.metodoPago}</p>
            <p><strong>Dirección:</strong> {pedido.direccion}</p>
            <p><strong>Total:</strong> <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#9C0D38' }}>${pedido.total.toFixed(2)}</span></p>
          </div>
        </div>
        
        {/* Estados */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
          <span style={{ 
            padding: '5px 12px', 
            borderRadius: '15px', 
            fontSize: '12px',
            fontWeight: 'bold',
            color: 'white',
            background: obtenerEstadoColor(pedido.estado)
          }}>
            Estado: {pedido.estado.toUpperCase()}
          </span>
          <span style={{ 
            padding: '5px 12px', 
            borderRadius: '15px', 
            fontSize: '12px',
            fontWeight: 'bold',
            color: 'white',
            background: obtenerEstadoPagoColor(pedido.estadoPago)
          }}>
            Pago: {pedido.estadoPago.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Lista de productos */}
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '10px', 
        marginBottom: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>
          Productos ({pedido.productos?.length || 0})
        </h4>
        
        {pedido.productos && pedido.productos.length > 0 ? (
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {pedido.productos.map((producto, index) => (
              <div key={index} className="producto-detalle" style={{ 
                display: 'flex',
                gap: '15px',
                padding: '10px 0',
                borderBottom: index < pedido.productos.length - 1 ? '1px solid #eee' : 'none'
              }}>
                <img 
                  src={producto.imagen || producto.images?.[0] || 'https://via.placeholder.com/80x80?text=Sin+Imagen'} 
                  alt={producto.nombre || 'Producto'}
                  className="imagen-producto"
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '1px solid #ddd'
                  }}
                />
                <div className="info-producto" style={{ flex: 1 }}>
                  <div className="titulo" style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '5px' }}>
                    {producto.nombre || 'Producto sin nombre'}
                  </div>
                  <div className="extra-info" style={{ fontSize: '14px', color: '#666' }}>
                    <p style={{ margin: '2px 0' }}>
                      <strong>Cantidad:</strong> {producto.cantidad || 1}
                    </p>
                    <p style={{ margin: '2px 0' }}>
                      <strong>Precio unitario:</strong> ${(producto.precio || 0).toFixed(2)}
                    </p>
                    <p style={{ margin: '2px 0' }}>
                      <strong>Subtotal:</strong> ${((producto.precio || 0) * (producto.cantidad || 1)).toFixed(2)}
                    </p>
                    {producto.descripcion && (
                      <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#888' }}>
                        {producto.descripcion}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '20px',
            color: '#666',
            background: '#f8f9fa',
            borderRadius: '8px'
          }}>
            <p>No hay productos en este pedido</p>
          </div>
        )}
      </div>

      {/* Información adicional */}
      {pedido.ventaOriginal && (
        <div style={{ 
          background: 'white', 
          padding: '15px', 
          borderRadius: '10px', 
          marginBottom: '20px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '14px' }}>
            Información adicional
          </h4>
          <div style={{ fontSize: '12px', color: '#666' }}>
            <p><strong>ID de venta:</strong> {pedido.ventaOriginal._id}</p>
            <p><strong>Creado:</strong> {new Date(pedido.ventaOriginal.createdAt).toLocaleString()}</p>
            {pedido.ventaOriginal.updatedAt && (
              <p><strong>Última actualización:</strong> {new Date(pedido.ventaOriginal.updatedAt).toLocaleString()}</p>
            )}
          </div>
        </div>
      )}

      {/* Botones de acción */}
      <div className="botones" style={{ 
        display: 'flex', 
        flexWrap: 'wrap',
        gap: '10px', 
        marginTop: 'auto',
        padding: '20px',
        background: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {/* Botón Completar - solo si no está completado o cancelado */}
        {pedido.estado !== 'completado' && pedido.estado !== 'cancelado' && (
          <button 
            className="btn completado" 
            onClick={onCompletar}
            disabled={loading}
            style={{
              padding: '12px 20px',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              background: '#9C0D38', // Color actualizado
              color: 'white',
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? 'Procesando...' : 'Completar Pedido'}
          </button>
        )}

        {/* Botón Cancelar - solo si no está completado o ya cancelado */}
        {pedido.estado !== 'completado' && pedido.estado !== 'cancelado' && (
          <button 
            className="btn cancelar" 
            onClick={onCancelar}
            disabled={loading}
            style={{
              padding: '12px 20px',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              background: '#CF5375', // Color actualizado
              color: 'white',
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? 'Procesando...' : 'Cancelar Pedido'}
          </button>
        )}

        {/* Botón Marcar como Pagado - solo si el pago está pendiente */}
        {pedido.estadoPago === 'pendiente' && pedido.estado !== 'cancelado' && (
          <button 
            className="btn marcar-pagado" 
            onClick={onMarcarPagado}
            disabled={loading}
            style={{
              padding: '12px 20px',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              background: '#DABBF5', // Color actualizado
              color: '#212529',
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? 'Procesando...' : 'Marcar como Pagado'}
          </button>
        )}

        {/* Botón Descargar - siempre disponible */}
        <button 
          className="btn descargar" 
          onClick={onDescargar}
          disabled={loading}
          style={{
            padding: '12px 20px',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            background: '#9C0D38', // Color actualizado
            color: 'white',
            transition: 'all 0.3s ease'
          }}
        >
          {loading ? '⏳ Generando...' : 'Descargar Comprobante'}
        </button>

        {/* Información del estado actual */}
        <div style={{ 
          width: '100%', 
          marginTop: '15px', 
          padding: '10px',
          background: '#f8f9fa',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#666'
        }}>
          <strong>Acciones disponibles:</strong>
          <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
            {pedido.estado !== 'completado' && pedido.estado !== 'cancelado' && (
              <>
                <li>Completar o cancelar el pedido</li>
                {pedido.estadoPago === 'pendiente' && <li>Confirmar el pago</li>}
              </>
            )}
            <li>Descargar comprobante en cualquier momento</li>
            {pedido.estado === 'completado' && (
              <li style={{ color: '#9C0D38' }}> Pedido completado - Solo descarga disponible</li>
            )}
            {pedido.estado === 'cancelado' && (
              <li style={{ color: '#CF5375' }}> Pedido cancelado - Solo descarga disponible</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DetallePedido;
