import React from 'react';
import '../css/ContactUs.css'; // Importamos los estilos

// Este componente muestra un banner bonito para invitar a la gente a contactarnos
const ContactBanner = () => {
  return (
    <div className="contact-banner"> {/* Contenedor principal con estilos */}
      <h2>Contáctanos</h2> {/* Título grande */}
      <div className="underline"></div> {/* Línea decorativa debajo del título */}
      <p>¡Nos encantaría saber de ti!</p> {/* Mensaje corto de bienvenida */}
      <p>
        Si tienes alguna pregunta, sugerencia o necesitas más información sobre nuestros productos o servicios,
        no dudes en ponerte en contacto con nosotros.
        <br />
        ¡Esperamos tu mensaje!
      </p> {/* Mensaje completo invitando a escribirnos */}
    </div>
  );
};

export default ContactBanner;
