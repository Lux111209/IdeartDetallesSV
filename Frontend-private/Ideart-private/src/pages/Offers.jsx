import React from "react";
import Sidebar from "../components/Sidebar";

const Offers = () => {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <h1 className="titulo">Ofertas</h1>
        <p>Aquí puedes gestionar las ofertas disponibles.</p>
        {/* Aquí puedes agregar más contenido relacionado con las ofertas */}
      </div>
    </div>
  );
}

export default Offers;