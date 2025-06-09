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
        <section className="categories">
          <h3>Categorías</h3>
          <div className="category-cards">
            <CategoryCard image="/assets/shirt.png" title="Category" />
            <CategoryCard image="/assets/keychain.png" title="Category" />
            <CategoryCard image="/assets/photo.png" title="Category" />
            <CategoryCard image="/assets/mug.png" title="Category" />
          </div>
        </section>

        <section className="products">
          <h3>Productos</h3>
          <div className="product-cards">
            <ProductCard image="/assets/mousepad-snoopy.png" title="Mousepad Snoopy" />
            <ProductCard image="/assets/mousepad-dc.png" title="3 Pack mousepad DC" />
            <ProductCard image="/assets/keychain-dad.png" title="Llavero para papá" />
            <ProductCard image="/assets/termo.png" title="Termo Personalizado" />
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default Product;
