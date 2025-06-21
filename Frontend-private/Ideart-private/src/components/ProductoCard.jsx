import React from "react";

const ProductoCard = ({ product }) => {
  return (
    <div className="product-card">
      <img
        src={product.image || "/placeholder.jpg"}
        alt={product.name}
        className="product-image"
      />
      <h4>${product.price}</h4>
      <p>{product.name}</p>
      <div className="product-info">
        <span>{product.stock} Stock</span>
        <span>{product.orders} Órdenes</span>
        <span>{product.published ? "Publicado" : "No Publicado"}</span>
      </div>
    </div>
  );
};

export default ProductoCard;
