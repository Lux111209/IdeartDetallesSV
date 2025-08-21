import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "../css/ProductCard.css";

const ProductCard = ({ product }) => {
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const newErrors = [];

    if (!product) {
      newErrors.push("Producto no disponible");
    } else {
      if (!product.name?.trim()) newErrors.push("Nombre es requerido");
      if (product.price == null || isNaN(product.price) || product.price <= 0)
        newErrors.push("Precio debe ser un número positivo");
      if (product.stock == null || isNaN(product.stock) || product.stock < 0)
        newErrors.push("Stock debe ser cero o mayor");
      if (!product.productType?.trim()) newErrors.push("Tipo de producto requerido");
      if (!product.size?.trim()) newErrors.push("Tamaño requerido");
    }

    setErrors(newErrors);

    if (newErrors.length > 0) {
      toast.warn("Producto con errores: " + newErrors.join(", "), { autoClose: 3000 });
    }
  }, [product]);

  if (!product) return null;

  const firstImage =
    product.images?.[0] || "https://via.placeholder.com/220x150?text=Sin+Imagen";

  return (
    <div
      className="product-card"
      style={{
        border: errors.length > 0 ? "2px solid #CF5375" : "1px solid #ddd",
        borderRadius: "12px",
        overflow: "hidden",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        cursor: "pointer",
      }}
      tabIndex={0}
      role="article"
      aria-label={product.name || "Producto sin nombre"}
    >
      {/* Imagen */}
      <div
        className="product-img"
        style={{
          width: "100%",
          height: "150px",
          overflow: "hidden",
        }}
      >
        <img
          src={firstImage}
          alt={product.name || "Producto sin nombre"}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>

      {/* Información principal */}
      <div
        className="product-info"
        style={{ padding: "10px", textAlign: "center" }}
      >
        <h3 style={{ margin: "5px 0", color: "#9C0D38" }}>
          ${product.price != null ? product.price.toFixed(2) : "N/A"}
        </h3>
        <p style={{ margin: "5px 0", fontWeight: "bold" }}>
          {product.name || "Sin nombre"}
        </p>

        {/* Detalles extra */}
        <div
          className="product-details"
          style={{
            display: "flex",
            justifyContent: "space-around",
            fontSize: "12px",
            color: "#555",
            marginTop: "5px",
          }}
        >
          <span>
            {product.stock != null ? `${product.stock} en stock` : "Stock no disponible"}
          </span>
          <span>{product.productType || "Tipo desconocido"}</span>
          <span>{product.size || "Tamaño no especificado"}</span>
        </div>

        {/* Errores */}
        {errors.length > 0 && (
          <ul style={{ color: "#CF5375", fontSize: "12px", marginTop: "5px" }}>
            {errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
