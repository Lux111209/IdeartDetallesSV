import React, { useState, useEffect } from "react";
import TopBar from "../components/TopBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../css/Promotions.css";

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    // Simulamos promociones de la tienda
    const storePromotions = [
      {
        id: 1,
        titulo: "2x1 en Tazas Personalizadas",
        descripcion: "Lleva 2 tazas al precio de 1 solo esta semana.",
        imagen: "https://via.placeholder.com/200",
      },
      {
        id: 2,
        titulo: "20% de Descuento en Peluches",
        descripcion: "Todos los peluches con descuento hasta fin de mes.",
        imagen: "https://via.placeholder.com/200",
      },
    ];
    setPromotions(storePromotions);
  }, []);

  return (
    <>
      <TopBar />
      <Navbar />
      <div className="promotions-page">
        <div className="promotions-box">
          <h2 className="promotions-header">Promociones y Ofertas</h2>

          {promotions.length > 0 ? (
            <div className="promotions-grid">
              {promotions.map((promo) => (
                <div key={promo.id} className="promotion-card">
                  <img src={promo.imagen} alt={promo.titulo} />
                  <h3>{promo.titulo}</h3>
                  <p>{promo.descripcion}</p>
                  <button className="btn-claim">Aprovechar Oferta</button>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-message">No hay promociones disponibles.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Promotions;
