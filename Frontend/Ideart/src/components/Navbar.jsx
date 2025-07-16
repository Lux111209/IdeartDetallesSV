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
    navigate('/login'); // Redirige a la página de login después del logout
  };

  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li className={path === '/category' ? 'active' : ''}>
          <Link to="/category" className="nav-item">Categorías</Link>
        </li>
        <li className={path === '/home' ? 'active' : ''}>
          <Link to="/home" className="nav-item">Inicio</Link>
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

        <li className={`nav-settings ${path === '/settings' ? 'active' : ''}`}>
          <Link to="/settings" className="nav-item nav-icon-link">
            <img
              src="/settings.png"
              alt="Configuración"
              className="settings-icon"
            />
          </Link>
        </li>

        {/* Ícono de cerrar sesión */}
        <li
          className="nav-icon-link logout-icon"
          onClick={handleLogout}
          title="Cerrar sesión"
          style={{ cursor: 'pointer' }}
        >
          <LogOut size={28} color="white" />
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
