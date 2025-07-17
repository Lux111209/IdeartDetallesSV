import React from 'react';
import useFetchProducts from '../hooks/useFetchProducts';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TopBar from '../components/TopBar';
import ProductCard from '../components/ProductCard';
import '../css/Products.css';

// Componente para mostrar la lista de productos
const Product = () => {
  const { products, loadingProducts } = useFetchProducts();

  // Renderiza la página de productos
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
          {loadingProducts ? (
            <p className="loading-text">Cargando productos...</p>
          ) : (
            <div className="product-cards">
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  image={product.images?.[0] || '/default.jpg'}
                  title={product.name}
                  price={product.price}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <Footer />
    </>
  );
};

export default Product;
