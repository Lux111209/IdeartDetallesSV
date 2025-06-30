// src/pages/Product.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TopBar from '../components/TopBar';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import '../css/Products.css';

const Product = () => {
  return (
    <>
      <div className="top-bar">
        <TopBar />
      </div>

      <div className="navbar-wrapper">
        <Navbar />
      </div>

      <div className="product-page">
        <section className="products">
          <h3>Productos</h3>
          <div className="product-cards">
            <ProductCard image="/P1.jpg" title="Mousepad Snoopy" price="12" />
            <ProductCard image="/P2.jpg" title="3 Pack mousepad DC" price="12"/>
            <ProductCard image="/P3.jpg" title="Llavero para papá" price="12"/>
            <ProductCard image="/P4.jpg" title="Termo Personalizado"price="12" />
            <ProductCard image="/P1.jpg" title="Mousepad Snoopy" price="12"/>
            <ProductCard image="/P2.jpg" title="3 Pack mousepad DC"price="12" />
            <ProductCard image="/P3.jpg" title="Llavero para papá" price="12"/>
            <ProductCard image="/P4.jpg" title="Termo Personalizado" price="12" />
            <ProductCard image="/P1.jpg" title="Mousepad Snoopy" price="12"/>
            <ProductCard image="/P2.jpg" title="3 Pack mousepad DC" price="12"/>
            <ProductCard image="/P3.jpg" title="Llavero para papá" price="12"/>
            <ProductCard image="/P4.jpg" title="Termo Personalizado" price="12" />
            <ProductCard image="/P1.jpg" title="Mousepad Snoopy" price="12" />
            <ProductCard image="/P2.jpg" title="3 Pack mousepad DC" price="12" />
            <ProductCard image="/P3.jpg" title="Llavero para papá" price="12" />
            <ProductCard image="/P4.jpg" title="Termo Personalizado" price="12" />
            <ProductCard image="/P1.jpg" title="Mousepad Snoopy" price="12" />
            <ProductCard image="/P2.jpg" title="3 Pack mousepad DC" price="12" />
            <ProductCard image="/P3.jpg" title="Llavero para papá" price="12" />
            <ProductCard image="/P4.jpg" title="Termo Personalizado" price="12" />
            <ProductCard image="/P1.jpg" title="Mousepad Snoopy" price="12" />
            <ProductCard image="/P2.jpg" title="3 Pack mousepad DC" price="12" />
            <ProductCard image="/P3.jpg" title="Llavero para papá" price="12" />
            <ProductCard image="/P4.jpg" title="Termo Personalizado" price="12" />
            <ProductCard image="/P1.jpg" title="Mousepad Snoopy" price="12" />
            <ProductCard image="/P2.jpg" title="3 Pack mousepad DC" price="12" />
            <ProductCard image="/P3.jpg" title="Llavero para papá" price="12" />
            <ProductCard image="/P4.jpg" title="Termo Personalizado" price="12" />
            <ProductCard image="/P1.jpg" title="Mousepad Snoopy"price="12" />
            <ProductCard image="/P2.jpg" title="3 Pack mousepad DC" price="12" />
            <ProductCard image="/P3.jpg" title="Llavero para papá" price="12" />
            <ProductCard image="/P4.jpg" title="Termo Personalizado" price="12" />
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default Product;
