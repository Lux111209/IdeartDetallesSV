import "../css/Personalizaciones.css";

export default function PersonalizacionCard({ item, onClick, activo }) {
  return (
    <div
      className={`card-solicitud ${activo ? "activa" : ""}`}
      onClick={onClick}
    >
      <div className="icono-cliente">👤</div>
      <div className="info">
        <p className="nombre">{item.nombre}</p>
        <p>{item.producto}</p>
        <p>{item.email}</p>
      </div>
    </div>
  );
}
