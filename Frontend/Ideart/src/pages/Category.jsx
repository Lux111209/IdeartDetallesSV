import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TopBar from '../components/TopBar';
import CategoryCard from '../components/CategoryCard';
import '../css/Products.css';

const Category = () => {
  return (
    <>
      <div className="top-bar">
        <TopBar />
      </div>

      <div className="navbar-wrapper">
        <Navbar />
      </div>

      <div className="category-page">
        <section className="categories">
          <h3>Categorías</h3>
          <div className="category-cards">
            <CategoryCard image="/C1.jpg" title="Tazas" />
            <CategoryCard image="/C2.jpg" title="Ropa" />
            <CategoryCard image="/C3.jpg" title="Accesorios" />
            <CategoryCard image="/C4.jpg" title="Entretenimiento" />
          </div>
        </section>

        <section className="categories">
          <h3>Subcategorías</h3>
          <div className="category-cards">
            <CategoryCard image="/C1.jpg" title="Tazas" />
            <CategoryCard image="/C2.jpg" title="Termos" />
            <CategoryCard image="/C3.jpg" title="Camisas" />
            <CategoryCard image="/C4.jpg" title="Llaveros" />
            <CategoryCard image="/C1.jpg" title="Destapadores" />
            <CategoryCard image="/C2.jpg" title="Hoodies" />
            <CategoryCard image="/C3.jpg" title="Pijamas" />
            <CategoryCard image="/C4.jpg" title="Jarras" />
            <CategoryCard image="/C2.jpg" title="Termos" />
            <CategoryCard image="/C3.jpg" title="Camisas" />
            <CategoryCard image="/C4.jpg" title="Category" />
            <CategoryCard image="/C2.jpg" title="Termos" />
            <CategoryCard image="/C3.jpg" title="Camisas" />
            <CategoryCard image="/C4.jpg" title="Category" />
            <CategoryCard image="/C2.jpg" title="Termos" />
            <CategoryCard image="/C3.jpg" title="Camisas" />
            <CategoryCard image="/C4.jpg" title="Category" />
            <CategoryCard image="/C2.jpg" title="Termos" />
            <CategoryCard image="/C3.jpg" title="Camisas" />
            <CategoryCard image="/C4.jpg" title="Category" />
          </div>
        </section>

      </div>

      <Footer />
    </>
  );
};

export default Category;
