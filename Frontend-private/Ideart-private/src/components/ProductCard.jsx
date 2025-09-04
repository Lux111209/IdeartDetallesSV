import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "../css/ProductCard.css";

const ProductCard = ({ product }) => {
  const {
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: product?.name || "",
      price: product?.price || "",
      stock: product?.stock || "",
      productType: product?.productType || "",
      size: product?.size || "",
    },
  });

  if (!product) return null;

  const firstImage =
    product.images?.[0] || "https://via.placeholder.com/220x150?text=Sin+Imagen";

  // Mostrar toast si hay errores
  React.useEffect(() => {
    const errorKeys = Object.keys(errors);
    if (errorKeys.length > 0) {
      toast.warn(
        "Producto con errores: " + errorKeys.map((key) => errors[key]?.message).join(", "),
        { autoClose: 3000 }
      );
    }
  }, [errors]);

  return (
    <div
      className={`product-card ${Object.keys(errors).length > 0 ? "error-card" : ""}`}
      tabIndex={0}
      role="article"
      aria-label={product.name || "Producto sin nombre"}
    >
      {/* Imagen */}
      <div className="product-img">
        <img
          src={firstImage}
          alt={product.name || "Producto sin nombre"}
        />
      </div>

      {/* Información principal */}
      <div className="product-info">
        {/* Precio */}
        <h3 className="product-price">
          ${product.price != null ? Number(product.price).toFixed(2) : "N/A"}
        </h3>

        {/* Nombre */}
        <p className="product-name">{product.name || "Sin nombre"}</p>

        {/* Detalles */}
        <div className="product-details">
          <span>
            {product.stock != null
              ? `${product.stock} en stock`
              : "Stock no disponible"}
          </span>
          <span>{product.productType || "Tipo desconocido"}</span>
          <span>{product.size || "Tamaño no especificado"}</span>
        </div>

        {/* Validaciones con react-hook-form */}
        <ul className="error-list">
          {errors.name && <li>{errors.name.message}</li>}
          {errors.price && <li>{errors.price.message}</li>}
          {errors.stock && <li>{errors.stock.message}</li>}
          {errors.productType && <li>{errors.productType.message}</li>}
          {errors.size && <li>{errors.size.message}</li>}
        </ul>
      </div>
    </div>
  );
};

export default ProductCard;
