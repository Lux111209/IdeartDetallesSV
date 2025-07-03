import React from "react";
import { Link } from "react-router-dom";
import "../css/TopBar.css";

const TopBar = () => {
  return (
    <div className="top-bar">
      <Link to="/">
        <img src="/logooo.png" className="logo" alt="Logo" />
      </Link>

      <div className="search-section">
        <input type="text" placeholder="Buscar" className="lupa" />
        <img src="/lupa.png" className="search-icon" alt="Buscar" />
      </div>

      <div className="icon-container">
        <Link to="/profile">
          <img src="/perfil.png" className="img" alt="Perfil" />
        </Link>

        <Link to="/shoppingcart">
          <img src="/carrito.png" className="img" alt="Carrito" />
        </Link>
      </div>
    </div>
  );
};

export default TopBar;
