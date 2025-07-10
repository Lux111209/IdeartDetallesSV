import React from "react";
import Sidebar from "../components/Sidebar";

const Review = () => {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <h1 className="titulo">Reseñas</h1>
        <p>Aquí van las reseñas</p>
        {/* Aquí puedes agregar más contenido relacionado con las ofertas */}
      </div>
    </div>
  );
}

export default Review;