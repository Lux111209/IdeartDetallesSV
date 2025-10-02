import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/AddProductModal.css";

const AddProductModal = ({ onClose, onAdd }) => {
  const [categories, setCategories] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      name: "",
      price: "",
      stock: "",
      productType: "",
      size: "",
      color: "#000000",
      description: "",
      material: "",
      tags: [],
      imageFile: null,
    },
  });

  const imageFile = watch("imageFile");

  useEffect(() => {
    // Fetch de categorías desde el backend
    fetch("http://localhost:5000/api/products/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCategories(data.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name.trim());
      formData.append("price", data.price);
      formData.append("stock", data.stock);
      formData.append("productType", data.productType);
      formData.append("size", data.size);
      formData.append("color", data.color);
      formData.append("description", data.description);
      formData.append("material", data.material);
      data.tags.forEach((tag) => formData.append("tags[]", tag));
      if (data.imageFile && data.imageFile[0]) {
        formData.append("images", data.imageFile[0]);
      }

      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (result.success) {
        toast.success("Producto agregado con éxito", { autoClose: 2500 });
        onAdd(result.data);
        onClose();
      } else {
        toast.error(result.message || "Error al agregar producto");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al agregar producto");
    }
  };

  return (
    <div className="modal-overlay">
      <form className="modal-content" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="modal-inner-box">
          <h2>Agregar Nuevo Producto</h2>

          <div className="modal-form-content">
            <input
              type="text"
              placeholder="Nombre"
              {...register("name", { required: "El nombre es requerido", minLength: { value: 3, message: "Mínimo 3 caracteres" } })}
            />
            {errors.name && <p className="error">{errors.name.message}</p>}

            <input
              type="number"
              step="0.01"
              placeholder="Precio"
              {...register("price", { required: "El precio es requerido", min: { value: 0.01, message: "El precio debe ser mayor a 0" } })}
            />
            {errors.price && <p className="error">{errors.price.message}</p>}

            <input
              type="number"
              placeholder="Stock"
              {...register("stock", { required: "El stock es requerido", min: { value: 0, message: "El stock no puede ser negativo" } })}
            />
            {errors.stock && <p className="error">{errors.stock.message}</p>}

            <select {...register("productType", { required: "La categoría es requerida" })}>
              <option value="">Selecciona una categoría</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            {errors.productType && <p className="error">{errors.productType.message}</p>}

            <input
              type="text"
              placeholder="Tamaño"
              {...register("size", { required: "El tamaño es requerido" })}
            />
            {errors.size && <p className="error">{errors.size.message}</p>}

            <label>
              Color:
              <input
                type="color"
                {...register("color", { required: "El color es requerido" })}
                style={{ marginLeft: "8px", cursor: "pointer", width: "50px", height: "30px" }}
              />
            </label>
            {errors.color && <p className="error">{errors.color.message}</p>}

            <textarea
              placeholder="Descripción"
              {...register("description")}
            />

            <input
              type="text"
              placeholder="Material"
              {...register("material")}
            />

            <label>
              Seleccionar imagen:
              <input
                type="file"
                accept="image/*"
                {...register("imageFile", { required: "La imagen es obligatoria" })}
                onChange={(e) => setValue("imageFile", e.target.files)}
              />
            </label>
            {errors.imageFile && <p className="error">{errors.imageFile.message}</p>}

            {imageFile && imageFile[0] && (
              <div className="image-preview">
                <img src={URL.createObjectURL(imageFile[0])} alt="Preview" style={{ maxWidth: "150px" }} />
              </div>
            )}
          </div>
        </div>

        <div className="modal-buttons">
          <button type="submit" className="save">Guardar</button>
          <button type="button" className="cancel" onClick={onClose}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default AddProductModal;
