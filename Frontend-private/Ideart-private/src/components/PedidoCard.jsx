import "../css/Pedidos.css";

// Componente PedidoCard para mostrar una tarjeta de pedido
export default function PedidoCard({ pedido, onClick, activo }) {
  return (
    <div className={`card-pedido ${activo ? "activa" : ""}`} onClick={onClick}>
      <div className="icono-cliente">👤</div>
      <div className="info">
        <p className="nombre">{pedido.nombre}</p>
        <p>N° {pedido.numero}</p>
        <p>{pedido.email}</p>
      </div>
    </div>
  );
}
