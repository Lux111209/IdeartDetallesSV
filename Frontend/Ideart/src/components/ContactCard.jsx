// Importaciones necesarias
import React from 'react';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaCommentDots } from 'react-icons/fa';
import '../css/ContactUs.css';

// Íconos disponibles
const icons = {
  email: <FaEnvelope size={24} />,
  phone: <FaPhoneAlt size={24} />,
  location: <FaMapMarkerAlt size={24} />,
  chat: <FaCommentDots size={24} />
};

// Componente de tarjeta de contacto
const ContactCard = ({ icon, text, text1, text2, text3, text4, text5, text6 }) => {
  // Si tiene ícono y texto, muestra ícono con texto
  if (icon && text) {
    return (
      <div className="contact-card icon-card">
        {icons[icon]}
        <strong>{text}</strong>
      </div>
    );
  }

  // Si tiene varios textos, muestra contenido en párrafos
  if (text1) {
    return (
      <div className="contact-card">
        <p><strong>{text1}</strong></p>
        <p><strong>{text2}</strong></p>
        <p><strong>{text3}</strong></p>
        <br />
        <p>{text4}</p>
        <p>{text5}</p>
        <p><strong>{text6}</strong></p>
      </div>
    );
  }

  // Si no hay datos, no muestra nada
  return null;
};

// Exporto el componente
export default ContactCard;
