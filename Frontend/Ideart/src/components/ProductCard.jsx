// src/components/ProductCard.jsx
import React from 'react';
import '../css/Products.css';

const ProductCard = ({ image, title }) => {
  return (
    <div className="product-card">
      <img src={image} />
      <p>{title}</p>
    </div>
  );
};

export default ProductCard;
