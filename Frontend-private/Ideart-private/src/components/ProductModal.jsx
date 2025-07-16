import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/AddProductModal.css";

const COLORS = [
  "#fff", "#000", "#ff0", "#f00", "#0f0", "#00f", "#f0f", "#ff69b4", "#800080", "#999"
];

const ProductModal = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    productType: "",
    size: "",
    color: "",
    imageFile: null,
    imagePreview: null,
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        price: product.price || "",
        stock: product.stock || "",
        productType: product.productType || "",
        size: product.size || "",
        color: product.color || "",
        imageFile: null,
        imagePreview: product.images?.[0] || null,
      });
      setErrors({});
    }
  }, [product]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "El nombre es obligatorio 🫢";
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0)
      newErrors.price = "Precio inválido, no te pases 😒";
    if (!formData.stock || isNaN(formData.stock) || Number(formData.stock) < 0)
      newErrors.stock = "Stock no puede ser negativo 🤨";
    if (!formData.productType.trim()) newErrors.productType = "Falta el tipo 😤";
    if (!formData.size.trim()) newErrors.size = "¿Y la talla? 🤔";
    if (!formData.color) newErrors.color = "Seleccioná un color, porfa 🎨";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleColorSelect = (color) => {
    setFormData((prev) => ({ ...prev, color }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Porfa completá bien todo antes de guardar 🙏");
      return;
    }

    const updatedProduct = {
      ...product,
      name: formData.name.trim(),
      price: Number(formData.price),
      stock: Number(formData.stock),
      productType: formData.productType.trim(),
      size: formData.size.trim(),
      color: formData.color,
      images: [formData.imagePreview || "/images/placeholder.png"],
    };

    onSave(updatedProduct);
    toast.success("Producto actualizado con éxito ✨");
  };

  return (
    <div className="modal-overlay">
      <form className="modal-content" onSubmit={handleSubmit} noValidate>
        <h2>Editar Producto</h2>

        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={formData.name}
          onChange={handleInputChange}
        />
        {errors.name && <p className="error">{errors.name}</p>}

        <input
          type="number"
          step="0.01"
          name="price"
          placeholder="Precio"
          value={formData.price}
          onChange={handleInputChange}
        />
        {errors.price && <p className="error">{errors.price}</p>}

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={formData.stock}
          onChange={handleInputChange}
        />
        {errors.stock && <p className="error">{errors.stock}</p>}

        <input
          type="text"
          name="productType"
          placeholder="Tipo de producto"
          value={formData.productType}
          onChange={handleInputChange}
        />
        {errors.productType && <p className="error">{errors.productType}</p>}

        <input
          type="text"
          name="size"
          placeholder="Tamaño"
          value={formData.size}
          onChange={handleInputChange}
        />
        {errors.size && <p className="error">{errors.size}</p>}

        <label>
          Seleccionar imagen:
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>

        {formData.imagePreview && (
          <div className="image-preview">
            <img src={formData.imagePreview} alt="Preview" />
          </div>
        )}

        <div className="color-section">
          <label>Color</label>
          <div className="color-options" style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {COLORS.map((c) => (
              <div
                key={c}
                onClick={() => handleColorSelect(c)}
                className="color-circle"
                style={{
                  backgroundColor: c,
                  width: "25px",
                  height: "25px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  border: formData.color === c ? "3px solid #000" : "1px solid #333",
                }}
              />
            ))}
          </div>
        </div>
        {errors.color && <p className="error">{errors.color}</p>}

        <div className="modal-buttons">
          <button type="submit" className="save">Guardar Cambios</button>
          <button type="button" className="cancel" onClick={onClose}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default ProductModal;
