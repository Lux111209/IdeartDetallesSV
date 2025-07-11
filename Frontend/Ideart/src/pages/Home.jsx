import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TopBar from '../components/TopBar';
import '../css/Home.css';

const Home = () => {
  return (
    <>
      <div className="top-bar">
        <TopBar />
      </div>

      <div className="navbar-wrapper">
        <Navbar />
      </div>

      <div className="home">
        <section className="collage-grid">
          <div className="grid-item img5">
            <img src="/H2.jpg" alt="Decoración 1" />
          </div>
          <div className="grid-item img1">
            <img src="/H1.jpg" alt="Decoración 2" />
          </div>
          <div className="grid-item img2">
            <img src="/H3.jpg" alt="Decoración 3" />
          </div>
          <div className="grid-item img3">
            <img src="/H5.jpg" alt="Decoración 4" />
          </div>
          <div className="grid-item img4">
            <img src="/H6.jpg" alt="Decoración 5" />
          </div>
        </section>

        <section className="promotions">
          <h2>Promociones</h2>
          <div className="promotion-cards">
            <div className="promotion-card">
              <img src="/H8.jpg" alt="Camiseta promocional" />
            </div>
            <div className="promotion-card">
              <img src="/H7.jpg" alt="Taza promocional" />
            </div>
            <div className="promotion-card">
              <img src="/H9.jpg" alt="Llaveros promocionales" />
            </div>
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
          <img src="/H4.jpg" />
        </section>
      </div>

      <Footer />
    </>
  );
};

export default Home;
