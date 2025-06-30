// src/pages/ProductDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TopBar from "../components/TopBar";
import { useCart } from "../hooks/useCart";
import "../css/ProductDetail.css";

const ProductDetail = () => {
  const { nombre } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const { image, title, price = 15.59 } = location.state || {
    image: "/placeholder.jpg",
    title: decodeURIComponent(nombre),
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert("Selecciona una talla y un color antes de continuar.");
      return;
    }

    addToCart({
      title,
      image,
      price,
      size: selectedSize,
      color: selectedColor,
      quantity: 1,
    });

    alert("Se añadió un producto nuevo al carrito");
    navigate("/cart");
  };

  return (
    <>
      <TopBar />
      <Navbar />
      <div className="product-detail-container">
        <button onClick={() => navigate(-1)} className="back-button">← Regresar</button>
        <div className="product-detail-card">
          <div className="left-section">
            <img src={image} alt={title} className="main-image" />
            <div className="thumbnail-row">
              <img src={image} className="thumb" />
              <img src={image} className="thumb" />
              <div className="thumb extra">+3</div>
            </div>
            <h2>{title}</h2>
            <p className="description">
              Confeccionada en algodón suave de alta calidad, ideal para looks casuales o personalizar con tus propios diseños.
            </p>
          </div>

          <div className="right-section">
            <h4>Tallas</h4>
            <div className="sizes">
              {["XS", "S", "M", "L", "XL"].map((size) => (
                <button
                  key={size}
                  className={selectedSize === size ? "selected" : ""}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>

            <div className="reviews">
              <h4>Reseñas</h4>
              <p>★★★★☆</p>
            </div>

            <div className="price">
              <h4>Precio</h4>
              <p>${price}</p>
            </div>

            <div className="colors">
              <h4>Color</h4>
              <div className="color-dots">
                {["Negro", "Blanco", "Rojo", "Azul"].map((color) => (
                  <span
                    key={color}
                    className={`dot ${color.toLowerCase()} ${selectedColor === color ? "selected" : ""}`}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
            </div>

            <button className="add-to-cart" onClick={handleAddToCart}>
              Añadir carrito
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;
