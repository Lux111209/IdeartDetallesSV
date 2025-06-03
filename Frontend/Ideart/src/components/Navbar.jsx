import React from 'react';
import '../css/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li>Categorías</li>
        <li className="active">Inicio</li>
        <li>Productos</li>
        <li>Carrito</li>
        <li>Contáctanos</li>
        <li>Mi Perfil</li>
      </ul>
    </nav>
  );
};

export default Navbar;
