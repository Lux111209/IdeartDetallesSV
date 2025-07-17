import React from 'react';
import ContactBanner from '../components/ContactBanner';
import ContactForm from '../components/ContactForm';
import ContactCard from '../components/ContactCard';
import Footer from '../components/Footer';
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import '../css/ContactUs.css'; // Estilos de esta página

// Página de contacto principal
const ContactUs = () => {
  return (
    <>
      {/* Barra superior y navbar */}
      <div className="top-bar">
        <TopBar />
      </div>

      <div className="navbar-wrapper">
        <Navbar />
      </div>

      <div className="contactus-container">
        {/* Banner visual superior */}
        <ContactBanner />

        {/* Formulario y mensaje lateral */}
        <div className="contactus-content">
          <ContactForm />
          <div className="contactus-card-lateral">
            <ContactCard
              text1="¡Mantente al tanto de"
              text2="todas nuestras"
              text3="novedades!"
              text4="No te pierdas de nada,"
              text5="únete a nuestra"
              text6="comunidad Ideart hoy!"
            />
          </div>
        </div>

        {/* Datos de contacto con íconos */}
        <div className="contactus-info">
          <ContactCard icon="email" text="idea.artesv@gmail.com" />
          <ContactCard icon="phone" text="+503 7811 - 2503" />
          <ContactCard icon="location" text="El Salvador, Ilopango, El Salvador" />
        </div>

        {/* Mapa de ubicación de la tienda */}
        <div className="mapa-contacto">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3876.275778201076!2d-89.12605409065998!3d13.70174008662937!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f6337456a7d85af%3A0x2c7856fbf58cbdc!2sIdeart.sv!5e0!3m2!1ses!2sgt!4v1750091909930!5m2!1ses!2sgt"
            width="100%"
            height="300"
            style={{ border: 0, borderRadius: '12px' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación Ideart"
          ></iframe>
          <ContactCard icon="chat" />
        </div>

        {/* Footer final */}
        <Footer />
      </div>
    </>
  );
};

export default ContactUs;
