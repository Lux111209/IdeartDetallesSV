import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/Products.css";

// Componente para mostrar una tarjeta de producto
const ProductCard = ({ _id, image, title, price = 19900 }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/products/${title}`, {
      state: {
        _id,        // Asegúrate de pasar el _id
        image,
        title,
        price
      },
    });
  };

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