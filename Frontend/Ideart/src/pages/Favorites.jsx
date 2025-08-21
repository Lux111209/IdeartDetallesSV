import React, { useState, useEffect } from "react";
import TopBar from "../components/TopBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../css/Favorites.css";

const Favorites = () => {
  // Simulación de productos guardados desde el carrito
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Simulamos obtener los productos guardados
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [
      {
        id: 1,
        nombre: "Caja de Regalo Personalizada",
        precio: "$15.99",
        imagen: "https://via.placeholder.com/150",
      },
      {
        id: 2,
        nombre: "Ramo de Flores Artesanales",
        precio: "$22.50",
        imagen: "https://via.placeholder.com/150",
      },
    ];
    setFavorites(savedFavorites);
  }, []);

  return (
    <>
      <TopBar />
      <Navbar />
      <div className="favorites-page">
        <div className="favorites-box">
          <h2 className="favorites-header">Mis Favoritos</h2>

          {favorites.length > 0 ? (
            <div className="favorites-grid">
              {favorites.map((item) => (
                <div key={item.id} className="favorite-card">
                  <img src={item.imagen} alt={item.nombre} />
                  <h3>{item.nombre}</h3>
                  <p>{item.precio}</p>
                  <button className="btn-buy">Comprar Ahora</button>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-message">No tienes productos guardados.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Favorites;
