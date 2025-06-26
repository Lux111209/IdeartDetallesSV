import React from 'react';
import '../css/ContactUs.css';

const ContactBanner = () => {
  return (
    <div className="contact-banner">
      <h2>Contáctanos</h2>
      <div className="underline"></div>
      <p>¡Nos encantaría saber de ti!</p>
      <p>
        Si tienes alguna pregunta, sugerencia o necesitas más información sobre nuestros productos o servicios,
        no dudes en ponerte en contacto con nosotros.
        <br />
        ¡Esperamos tu mensaje!
      </p>
    </div>
  );
};

export default ContactBanner;
