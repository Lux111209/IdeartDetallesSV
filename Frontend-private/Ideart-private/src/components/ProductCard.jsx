// src/components/ProductCard.jsx
import React from "react";
import "../css/ProductCard.css";

const ProductCard = ({ product }) => {
  // Si no hay imagen, usa un placeholder
  const firstImage = product.images?.[0] || "https://via.placeholder.com/220x150?text=Sin+Imagen";

  return (
    <div className="product-card">
      <div className="product-img">
        <img src={firstImage} alt={product.name} />
      </div>
      <div className="product-info">
        <h3>${product.price}</h3>
        <p>{product.name}</p>
        <div className="product-details">
          <span>{product.stock} en stock</span>
          <span>{product.productType}</span>
          <span>{product.size}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
