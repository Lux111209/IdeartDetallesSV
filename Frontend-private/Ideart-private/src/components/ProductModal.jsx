// src/components/ProductModal.jsx
import React, { useState, useEffect } from "react";
import "../css/ProductModal.css";
import { toast } from "react-toastify";

const ProductModal = ({ product, onClose, onSave, onDelete }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    productType: "",
    size: "",
    images: [], // para almacenar URL o archivo local (preview)
    imageFile: null, // archivo seleccionado
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
        images: product.images || [],
        imageFile: null,
      });
    }
  }, [product]);

  // Validación simple
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "El nombre es obligatorio";
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0)
      newErrors.price = "Precio debe ser un número positivo";
    if (
      formData.stock === "" ||
      isNaN(formData.stock) ||
      !Number.isInteger(Number(formData.stock)) ||
      Number(formData.stock) < 0
    )
      newErrors.stock = "Stock debe ser un número entero no negativo";
    if (!formData.productType.trim())
      newErrors.productType = "Tipo de producto es obligatorio";
    if (!formData.size.trim()) newErrors.size = "Tamaño es obligatorio";
    // Al menos una imagen o archivo seleccionado
    if (
      (!formData.images.length || formData.images.some((img) => !img.trim())) &&
      !formData.imageFile
    )
      newErrors.images = "Debe incluir al menos una imagen";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Crear URL para preview
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        images: [previewUrl], // Solo mostramos una para preview
      }));
    }
  };

  const handleSave = () => {
    if (validate()) {
      // Aquí podrías preparar los datos para enviarlos al backend, 
      // incluyendo el archivo en formData.imageFile si quieres subir la imagen

      onSave({ ...product, ...formData });
      toast.success("Producto guardado exitosamente");
      onClose();
    } else {
      toast.error("Por favor corrige los errores antes de guardar");
    }
  };

  const handleDelete = () => {
    if (window.confirm("¿Estás seguro que quieres eliminar este producto?")) {
      onDelete(product._id);
      toast.info("Producto eliminado");
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Editar Producto</h2>

        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <small className="error">{errors.name}</small>}

        <input
          type="number"
          name="price"
          placeholder="Precio"
          value={formData.price}
          onChange={handleChange}
        />
        {errors.price && <small className="error">{errors.price}</small>}

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={formData.stock}
          onChange={handleChange}
        />
        {errors.stock && <small className="error">{errors.stock}</small>}

        <input
          type="text"
          name="productType"
          placeholder="Tipo de producto"
          value={formData.productType}
          onChange={handleChange}
        />
        {errors.productType && (
          <small className="error">{errors.productType}</small>
        )}

        <input
          type="text"
          name="size"
          placeholder="Tamaño"
          value={formData.size}
          onChange={handleChange}
        />
        {errors.size && <small className="error">{errors.size}</small>}

        <label>Imagen actual / preview:</label>
        <div className="image-preview">
          {formData.images && formData.images[0] ? (
            <img
              src={formData.images[0]}
              alt="Preview"
              style={{ maxWidth: "150px", maxHeight: "150px", objectFit: "contain" }}
            />
          ) : (
            <p>No hay imagen</p>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        {errors.images && <small className="error">{errors.images}</small>}

        <div className="modal-buttons">
          <button className="save" onClick={handleSave}>
            Guardar
          </button>
          <button className="delete" onClick={handleDelete}>
            Eliminar
          </button>
          <button className="cancel" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
