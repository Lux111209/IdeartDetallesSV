import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TopBar from "../components/TopBar";
import "../css/Home.css";

const Home = () => {
  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    // Función para obtener promociones activas
    const fetchPromotions = async () => {
      try {
        const res = await fetch("https://ideartdetallessv-1.onrender.com/login/ofertas/activas");
        if (!res.ok) throw new Error("Error al obtener promociones");
        const data = await res.json();
        setPromotions(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchPromotions();
  }, []); // <-- Array vacío evita bucles infinitos

  return (
    <>
      {/* Barra superior */}
      <div className="top-bar">
        <TopBar />
      </div>

      {/* Navbar */}
      <div className="navbar-wrapper">
        <Navbar />
      </div>

      <div className="home">
        {/* Collage de imágenes */}
        <section className="collage-grid">
          <div className="grid-item img5">
            <img src="/H2.jpg" alt="Decoración 1" />
          </div>
          <div className="grid-item img1">
            <img src="/H1.jpg" alt="Decoración 2" />
          </div>
          <div className="grid-item img2">
            <img src="/H3.jpg" alt="Decoración 3" />
          </div>
          <div className="grid-item img3">
            <img src="/H5.jpg" alt="Decoración 4" />
          </div>
          <div className="grid-item img4">
            <img src="/H6.jpg" alt="Decoración 5" />
          </div>
        </section>

        {/* Sección de promociones */}
        {/* <section className="promotions">
          <h2>
            <Link to="/promotions" className="promotions-link">
              Promociones
            </Link>
          </h2>

          <div className="promotion-cards promotion-scroll">
            {promotions.length > 0 ? (
              promotions.map((promo) => (
                <div key={promo.id} className="promotion-card">
                  <img
                    src={promo.imagen || "/placeholder.jpg"}
                    alt={promo.titulo}
                  />
                  <h3>{promo.titulo}</h3>
                  <p>{promo.descripcion}</p>
                </div>
              ))
            ) : (
              <p>No hay promociones activas.</p>
            )}
          </div>
        </section>*/}

        {/* Sección de confianza */}
        <section className="trust">
          <div className="trust-text">
            <h2>¿Por qué confiar en Ideart?</h2>
            <p>
              En Ideart, no solo imprimimos, damos vida a tus ideas.<br />
              Somos una empresa salvadoreña especializada en productos
              personalizados y sublimación de alta calidad, con un enfoque en el
              detalle, la durabilidad y la creatividad.
            </p>
          </div>
          <img src="/H4.jpg" alt="Confianza Ideart" />
        </section>
      </div>

      <Footer />
    </>
  );
};

export default Home;