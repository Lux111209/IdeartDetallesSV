import React, { useEffect } from "react";
import { toast } from "react-toastify";
import "../css/ProductCard.css";

const ProductCard = ({ product }) => {
  // Al montar el componente, valido que tenga datos mínimos correctos
  useEffect(() => {
    if (!product.name || !product.price || product.stock == null) {
      // Muestro alerta toast si faltan datos importantes
      toast.warn("Producto con datos incompletos o inválidos", { autoClose: 3000 });
    }
  }, [product]);

  // Si no tiene imagen, pongo un placeholder para que no se vea vacío
  const firstImage = product.images?.[0] || "https://via.placeholder.com/220x150?text=Sin+Imagen";

  return (
    <div className="product-card">
      {/* Imagen del producto */}
      <div className="product-img">
        <img src={firstImage} alt={product.name || "Producto sin nombre"} />
      </div>

      {/* Información principal */}
      <div className="product-info">
        <h3>${product.price ?? "N/A"}</h3>
        <p>{product.name || "Sin nombre"}</p>

        {/* Detalles extra: stock, tipo y tamaño */}
        <div className="product-details">
          <span>{product.stock != null ? `${product.stock} en stock` : "Stock no disponible"}</span>
          <span>{product.productType || "Tipo desconocido"}</span>
          <span>{product.size || "Tamaño no especificado"}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
