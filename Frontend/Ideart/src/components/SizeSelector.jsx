import React from "react";

const sizes = ["XS", "S", "M", "L", "XL"];

// Componente para seleccionar el tamaño del producto
const SizeSelector = () => {
  return (
    <div className="size-selector">
      {sizes.map((size) => (
        <button key={size} className={`size-btn ${size === "S" ? "selected" : ""}`}>
          {size}
        </button>
      ))}
    </div>
  );
};

export default SizeSelector;
