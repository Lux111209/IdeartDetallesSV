import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../css/Home.css';

const Home = () => {
  return (
    <>
      <div className="top-bar">
        <img src="/assets/images/logooo.png" className="logo" />

        <div className="search-section">
          <input type="text" placeholder="Buscar" className="lupa" />
          <img src="/assets/images/lupa.png" className="img" />
        </div>

        <img src="/assets/images/perfil.png" className="img" />
        <img src="/assets/images/carrito.png" className="img" />
      </div>

      <div className="navbar-wrapper">
        <Navbar />
      </div>

      <div className="home">
        <section className="carousel">
          <img src="/assets/mugs.png" alt="Imagenes de sublimados" />
        </section>

        <section className="promotions">
          <h2>Promociones</h2>
          <div className="products">
            <img src="/assets/shirt.png" alt="Camisa promocional" />
            <img src="/assets/mug.png" alt="Taza personalizada" />
            <img src="/assets/keychain.png" alt="Llavero personalizado" />
          </div>
        </section>

        <section className="trust">
          <div className="trust-text">
            <h2>¿Por qué confiar en Ideart?</h2>
            <p>
              En Ideart, no solo imprimimos, damos vida a tus ideas.<br />
              Somos una empresa salvadoreña especializada en productos personalizados y sublimación de alta calidad,
              con un enfoque en el detalle, la durabilidad y la creatividad.
            </p>
          </div>
          <img src="/assets/back-shirts.png" alt="Camisetas estampadas" />
        </section>
      </div>

      <Footer />
    </>
  );
};

export default Home;
