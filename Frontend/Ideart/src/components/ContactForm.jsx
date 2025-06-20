import React from 'react';

const ContactForm = () => {
  return (
    <form className="contact-form">
      <div className="form-row">
        <input type="email" placeholder="Correo electrónico" />
        <input type="tel" placeholder="Número telefónico" />
      </div>
      <input type="text" placeholder="Nombre" />
      <textarea rows="5" placeholder="Mensaje"></textarea>
      <button type="submit">Enviar mensaje</button>
    </form>
  );
};

export default ContactForm;
