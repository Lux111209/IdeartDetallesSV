import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../css/Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li className={path === '/category' ? 'active' : ''}>
          <Link to="/category" className="nav-item">Categorías</Link>
        </li>
        <li className={path === '/' ? 'active' : ''}>
          <Link to="/" className="nav-item">Inicio</Link>
        </li>
        <li className={path === '/products' ? 'active' : ''}>
          <Link to="/products" className="nav-item">Productos</Link>
        </li>
        <li className={path === '/shoppingcart' ? 'active' : ''}>
          <Link to="/shoppingcart" className="nav-item">Carrito</Link>
        </li>
        <li className={path === '/contactus' ? 'active' : ''}>
          <Link to="/contactus" className="nav-item">Contáctanos</Link>
        </li>
        <li className={path === '/profile' ? 'active' : ''}>
          <Link to="/profile" className="nav-item">Mi Perfil</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
