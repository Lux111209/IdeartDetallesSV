import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react'; // Icono de logout
import '../css/Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const path = location.pathname;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li className={path === '/home' ? 'active' : ''}>
          <Link to="/home" className="nav-item">Inicio</Link>
        </li>
         <li className={path === '/category' ? 'active' : ''}>
          <Link to="/category" className="nav-item">Categorías</Link>
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
        <li className={path === '/reviews' ? 'active' : ''}>
          <Link to="/reviews" className="nav-item">Reseñas</Link>
        </li>
        <li className={path === '/profile' ? 'active' : ''}>
          <Link to="/profile" className="nav-item">Mi Perfil</Link>
        </li>
      </ul>

      {/*  Íconos aparte y pegados a la derecha */}
      <div className="nav-settings">
        <div
          className="logout-icon"
          onClick={handleLogout}
          title="Cerrar sesión"
        >
          <LogOut size={28} color="white" />
        </div>
        <Link to="/settings" className="nav-icon-link">
          <img
            src="/settings.png"
            alt="Configuración"
            className="settings-icon"
          />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
