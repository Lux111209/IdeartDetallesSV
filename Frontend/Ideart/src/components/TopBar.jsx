import React from "react";
import "../css/TopBar.css";

const TopBar = () => {
  return (
    <div className="top-bar">
      <img src="/logooo.png" className="logo" alt="Logo" />

      <div className="search-section">
        <input type="text" placeholder="Buscar" className="lupa" />
        <img src="/lupa.png" className="search-icon" alt="Buscar" />
      </div>

      <div className="icon-container">
        <img src="/perfil.png" className="img" alt="Perfil" />
        <img src="/carrito.png" className="img" alt="Carrito" />
      </div>
    </div>
  );
};

export default TopBar;
