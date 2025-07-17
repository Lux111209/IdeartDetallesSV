import React from 'react';
import '../css/Footer.css'; // Estilos del footer
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom'; // Para navegación interna

const Footer = () => {
  return (
    <footer className="footer">
      {/* Título del footer */}
      <p className="title">Ideart - Sublimados Personalizados</p>

      {/* Descripción corta */}
      <p className="footer-text">
        Transforma tus ideas en productos únicos con nuestro servicio de sublimados.
      </p>

      {/* Íconos de redes sociales */}
      <div className="social-icons">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faFacebookF} />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faInstagram} />
        </a>
        <a href="https://wa.me/50300000000" target="_blank" rel="noopener noreferrer">
          <FontAwesomeIcon icon={faWhatsapp} />
        </a>
      </div>

      {/* Correo de contacto */}
      <p>ideart.sv@gmail.com</p>

      {/* Enlace a términos usando Link de React Router */}
      <p>
        <Link to="/terminos" className="text-blue-600 hover:underline">
          Términos y Condiciones
        </Link>
      </p>

      {/* Derechos reservados */}
      <p>© 2025 Ideart - Todos los derechos reservados.</p>
    </footer>
  );
};

export default Footer;
