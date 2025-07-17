import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/Products.css";

// Componente para mostrar una tarjeta de producto
const ProductCard = ({ image, title, price = 19900 }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/products/${title}`, {
      state: { image, title, price },
    });
  };

  // Renderiza la tarjeta del producto
  // Al hacer clic, redirige a la página del producto con el título como parámetro
  // y pasa la imagen y el precio como estado
  return (
    <div className="product-card" onClick={handleClick}>
      <div className="image-wrapper">
        <img src={image} alt={title} />
      </div>
      <p>{title}</p>
    </div>
  );
};

export default ProductCard;

