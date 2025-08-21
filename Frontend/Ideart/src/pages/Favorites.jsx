import React, { useState, useEffect } from "react";
import TopBar from "../components/TopBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../css/Favorites.css";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
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
              {favorites.map((item, i) => (
                <div key={i} className="favorite-card">
                  <img src={item.image} alt={item.title} />
                  <h3>{item.title}</h3>
                  <p>${Number(item.price).toFixed(2)}</p>
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
