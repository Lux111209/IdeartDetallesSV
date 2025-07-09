import React, { useState } from "react";
import "../css/AddProductModal.css"; // Reusa el mismo estilo bonito del modal

const AddProductModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    productType: "",
    size: "",
    imageFile: null,
    imagePreview: null,
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Nombre es requerido";
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0)
      newErrors.price = "Precio debe ser un número positivo";
    if (!formData.stock || isNaN(formData.stock) || Number(formData.stock) < 0)
      newErrors.stock = "Stock debe ser cero o más";
    if (!formData.productType.trim()) newErrors.productType = "Tipo es requerido";
    if (!formData.size.trim()) newErrors.size = "Tamaño es requerido";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!validate()) return;

    // Crear nuevo producto simulado
    const newProduct = {
      _id: Date.now().toString(),
      name: formData.name.trim(),
      price: Number(formData.price),
      stock: Number(formData.stock),
      productType: formData.productType.trim(),
      size: formData.size.trim(),
      images: [formData.imagePreview || "/images/placeholder.png"],
    };

    onAdd(newProduct);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <form className="modal-content" onSubmit={handleSubmit} noValidate>
        <h2>Agregar Nuevo Producto</h2>

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

        <label style={{ marginBottom: "10px", fontWeight: "600" }}>
          Seleccionar imagen:
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>

        {formData.imagePreview && (
          <div className="image-preview">
            <img src={formData.imagePreview} alt="Preview" />
          </div>
        )}

        <div className="modal-buttons">
          <button type="submit" className="save">Guardar</button>
          <button type="button" className="cancel" onClick={onClose}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default AddProductModal;
