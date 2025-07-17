import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TopBar from '../components/TopBar';
import ReviewSection from '../components/Section';
import '../css/Reviews.css';

// Componente para mostrar las reseñas
const Reviews = () => {
  return (
    <>
      <div className="top-bar">
        <TopBar />
      </div>

      <div className="navbar-wrapper">
        <Navbar />
      </div>

      <div className="reviews-page">
        <ReviewSection />
      </div>

      <Footer />
    </>
  );
};

export default Reviews;
