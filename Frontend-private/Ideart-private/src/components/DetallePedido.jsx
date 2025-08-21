import React from "react";
import PropTypes from "prop-types";

const DetallePedido = ({
  pedido,
  onCompletar,
  onCancelar,
  onDescargar,
  onMarcarPagado,
  loading = false,
}) => {
  if (!pedido) {
    return (
      <div style={{ padding: "20px", color: "#666", textAlign: "center" }}>
        <p>No se ha seleccionado ningún pedido</p>
      </div>
    );
  }

  const obtenerEstadoColor = (estado) => {
    switch (estado) {
      case "completado":
        return "#9C0D38";
      case "cancelado":
        return "#CF5375";
      case "en_proceso":
        return "#993d55ff";
      case "pendiente":
        return "#af224cff";
      default:
        return "#DDF0FF";
    }
  };

  const obtenerEstadoPagoColor = (estadoPago) => {
    switch (estadoPago) {
      case "pagado":
        return "#9C0D38";
      case "pendiente":
        return "#DABBF5";
      case "rechazado":
        return "#CF5375";
      default:
        return "#2a455aff";
    }
  };

  const safeTotal = !isNaN(pedido.total) ? Number(pedido.total) : 0;
  const fechaCreacion = pedido.ventaOriginal?.createdAt
    ? new Date(pedido.ventaOriginal.createdAt).toLocaleString()
    : "N/A";
  const fechaActualizacion = pedido.ventaOriginal?.updatedAt
    ? new Date(pedido.ventaOriginal.updatedAt).toLocaleString()
    : null;

  return (
    <div className="detalle-pedido">
      {/* Header con información del cliente */}
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "20px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>
          Pedido #{pedido.id ? pedido.id.slice(-8) : "SIN-ID"}
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "15px",
          }}
        >
          <div>
            <p>
              <strong>Cliente:</strong> {pedido.clienteNombre || "Desconocido"}
            </p>
            <p>
              <strong>Email:</strong> {pedido.clienteEmail || "No registrado"}
            </p>
            <p>
              <strong>Fecha:</strong> {pedido.fecha || "N/A"}
            </p>
          </div>
          <div>
            <p>
              <strong>Método de pago:</strong> {pedido.metodoPago || "N/A"}
            </p>
            <p>
              <strong>Dirección:</strong> {pedido.direccion || "No especificada"}
            </p>
            <p>
              <strong>Total:</strong>{" "}
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#9C0D38",
                }}
              >
                ${safeTotal.toFixed(2)}
              </span>
            </p>
          </div>
        </div>

        {/* Estados */}
        <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
          <span
            style={{
              padding: "5px 12px",
              borderRadius: "15px",
              fontSize: "12px",
              fontWeight: "bold",
              color: "white",
              background: obtenerEstadoColor(pedido.estado),
            }}
          >
            Estado: {(pedido.estado || "N/A").toUpperCase()}
          </span>
          <span
            style={{
              padding: "5px 12px",
              borderRadius: "15px",
              fontSize: "12px",
              fontWeight: "bold",
              color: "white",
              background: obtenerEstadoPagoColor(pedido.estadoPago),
            }}
          >
            Pago: {(pedido.estadoPago || "N/A").toUpperCase()}
          </span>
        </div>
      </div>

      {/* Lista de productos */}
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "20px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <h4 style={{ margin: "0 0 15px 0", color: "#333" }}>
          Productos ({pedido.productos?.length || 0})
        </h4>

        {pedido.productos && pedido.productos.length > 0 ? (
          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            {pedido.productos.map((producto, index) => {
              const cantidad = producto.cantidad || 1;
              const precio = !isNaN(producto.precio)
                ? Number(producto.precio)
                : 0;
              const subtotal = precio * cantidad;

              return (
                <div
                  key={index}
                  className="producto-detalle"
                  style={{
                    display: "flex",
                    gap: "15px",
                    padding: "10px 0",
                    borderBottom:
                      index < pedido.productos.length - 1
                        ? "1px solid #eee"
                        : "none",
                  }}
                >
                  <img
                    src={
                      producto.imagen ||
                      producto.images?.[0] ||
                      "https://via.placeholder.com/80x80?text=Sin+Imagen"
                    }
                    alt={producto.nombre || "Producto"}
                    className="imagen-producto"
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                    }}
                  />
                  <div className="info-producto" style={{ flex: 1 }}>
                    <div
                      className="titulo"
                      style={{
                        fontWeight: "bold",
                        fontSize: "16px",
                        marginBottom: "5px",
                      }}
                    >
                      {producto.nombre || "Producto sin nombre"}
                    </div>
                    <div
                      className="extra-info"
                      style={{ fontSize: "14px", color: "#666" }}
                    >
                      <p style={{ margin: "2px 0" }}>
                        <strong>Cantidad:</strong> {cantidad}
                      </p>
                      <p style={{ margin: "2px 0" }}>
                        <strong>Precio unitario:</strong> ${precio.toFixed(2)}
                      </p>
                      <p style={{ margin: "2px 0" }}>
                        <strong>Subtotal:</strong> ${subtotal.toFixed(2)}
                      </p>
                      {producto.descripcion && (
                        <p
                          style={{
                            margin: "5px 0 0 0",
                            fontSize: "12px",
                            color: "#888",
                          }}
                        >
                          {producto.descripcion}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "20px",
              color: "#666",
              background: "#f8f9fa",
              borderRadius: "8px",
            }}
          >
            <p>No hay productos en este pedido</p>
          </div>
        )}
      </div>

      {/* Información adicional */}
      {pedido.ventaOriginal && (
        <div
          style={{
            background: "white",
            padding: "15px",
            borderRadius: "10px",
            marginBottom: "20px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <h4
            style={{ margin: "0 0 10px 0", color: "#333", fontSize: "14px" }}
          >
            Información adicional
          </h4>
          <div style={{ fontSize: "12px", color: "#666" }}>
            <p>
              <strong>ID de venta:</strong> {pedido.ventaOriginal._id || "N/A"}
            </p>
            <p>
              <strong>Creado:</strong> {fechaCreacion}
            </p>
            {fechaActualizacion && (
              <p>
                <strong>Última actualización:</strong> {fechaActualizacion}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Botones de acción */}
      <div
        className="botones"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginTop: "auto",
          padding: "20px",
          background: "white",
          borderRadius: "10px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        {pedido.estado !== "completado" && pedido.estado !== "cancelado" && (
          <button
            className="btn completado"
            onClick={onCompletar}
            disabled={loading}
          >
            {loading ? "Procesando..." : "Completar Pedido"}
          </button>
        )}

        {pedido.estado !== "completado" && pedido.estado !== "cancelado" && (
          <button
            className="btn cancelar"
            onClick={onCancelar}
            disabled={loading}
          >
            {loading ? "Procesando..." : "Cancelar Pedido"}
          </button>
        )}

        {pedido.estadoPago === "pendiente" && pedido.estado !== "cancelado" && (
          <button
            className="btn marcar-pagado"
            onClick={onMarcarPagado}
            disabled={loading}
          >
            {loading ? "Procesando..." : "Marcar como Pagado"}
          </button>
        )}

        <button
          className="btn descargar"
          onClick={onDescargar}
          disabled={loading}
        >
          {loading ? "⏳ Generando..." : "Descargar Comprobante"}
        </button>
      </div>
    </div>
  );
};

DetallePedido.propTypes = {
  pedido: PropTypes.shape({
    id: PropTypes.string,
    clienteNombre: PropTypes.string,
    clienteEmail: PropTypes.string,
    fecha: PropTypes.string,
    metodoPago: PropTypes.string,
    direccion: PropTypes.string,
    total: PropTypes.number,
    estado: PropTypes.string,
    estadoPago: PropTypes.string,
    productos: PropTypes.arrayOf(
      PropTypes.shape({
        nombre: PropTypes.string,
        cantidad: PropTypes.number,
        precio: PropTypes.number,
        descripcion: PropTypes.string,
        imagen: PropTypes.string,
        images: PropTypes.arrayOf(PropTypes.string),
      })
    ),
    ventaOriginal: PropTypes.shape({
      _id: PropTypes.string,
      createdAt: PropTypes.string,
      updatedAt: PropTypes.string,
    }),
  }),
  onCompletar: PropTypes.func,
  onCancelar: PropTypes.func,
  onDescargar: PropTypes.func,
  onMarcarPagado: PropTypes.func,
  loading: PropTypes.bool,
};

export default DetallePedido;
