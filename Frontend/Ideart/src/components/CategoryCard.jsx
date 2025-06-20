// src/components/CategoryCard.jsx
import React from 'react';
import "../css/Products.css";

const CategoryCard = ({ image, title }) => {
  return (
    <div className="category-card">
      <img src={image} />
      <p>{title}</p>
    </div>
  );
};

export default CategoryCard;
