// src/components/ProductCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/Products.css";

const ProductCard = ({ image, title, price = 19900 }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/products/${title}`, {
      state: { image, title, price },
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

