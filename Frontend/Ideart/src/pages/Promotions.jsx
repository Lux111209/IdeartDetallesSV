import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 
import TopBar from "../components/TopBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../css/Promotions.css";

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/ofertas/activas");
        const data = await res.json();
        if (data.success) {
          setPromotions(data.data); // aquí "data.data" viene del backend
        }
      } catch (error) {
        console.error("Error al cargar promociones:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  return (
    <>
      <TopBar />
      <Navbar />
      <div className="promotions-page">
        <div className="promotions-box">
          <h2 className="promotions-header">Promociones y Ofertas</h2>

          {loading ? (
            <p className="empty-message">Cargando promociones...</p>
          ) : promotions.length > 0 ? (
            <div className="promotions-grid">
              {promotions.map((promo) => (
                <div key={promo._id} className="promotion-card">
                  <img
                    src={promo.imagen || "https://via.placeholder.com/200"}
                    alt={promo.nombreOferta}
                  />
                  <h3>{promo.nombreOferta}</h3>
                  <p>{promo.descripcion || "Sin descripción disponible."}</p>
                  <p className="promo-discount">
                    Descuento: {promo.DescuentoRealizado}%
                  </p>

                  {/* Link al detalle de la oferta */}
                  <Link to={`/ofertas/${promo._id}`} className="btn-claim">
                    Aprovechar Oferta
                  </Link>
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
