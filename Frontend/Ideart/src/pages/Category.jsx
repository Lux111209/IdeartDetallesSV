// src/pages/Category.jsx
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TopBar from "../components/TopBar";
import CategoryCard from "../components/CategoryCard";
import useFetchCategories from "../hooks/useFetchCategories";
import "../css/Products.css";

// Componente para mostrar las categorías y subcategorías
const Category = () => {
  const { categories, loading, error } = useFetchCategories();

  return (
    <>
      <div className="top-bar"><TopBar /></div>
      <div className="navbar-wrapper"><Navbar /></div>

      <div className="category-page">
        {/* CATEGORÍAS */}
        <section className="categories">
          <h3>Categorías</h3>

          {loading && <p>Cargando categorías…</p>}
          {error && <p>Error: {error}</p>}

          <div className="category-cards">
            {categories.map((cat) => (
              <CategoryCard
                key={cat.name}
                image={cat.image}
                title={cat.name}
              />
            ))}
          </div>
        </section>

        {/* SUB‑CATEGORÍAS */}
        <section className="categories">
          <h3>Subcategorías</h3>
          <div className="category-cards">
            {categories.flatMap((cat) =>
              cat.subcategories.map((sub) => (
                <CategoryCard
                  key={`${cat.name}-${sub}`}
                  image={cat.image}   // podrías buscar otra imagen si prefieres
                  title={sub}
                />
              ))
            )}
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default Category;
