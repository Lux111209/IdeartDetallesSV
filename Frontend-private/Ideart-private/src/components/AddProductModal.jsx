import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/AddProductModal.css";

const AddProductModal = ({ onClose, onAdd }) => {
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
      imageFile: null,
    },
  });

  const imageFile = watch("imageFile");

  const onSubmit = (data) => {
    const newProduct = {
      _id: Date.now().toString(),
      name: data.name.trim(),
      price: Number(data.price),
      stock: Number(data.stock),
      productType: data.productType.trim(),
      size: data.size.trim(),
      color: data.color,
      images: [
        data.imageFile && data.imageFile[0]
          ? URL.createObjectURL(data.imageFile[0])
          : "/images/placeholder.png",
      ],
    };

    onAdd(newProduct);
    toast.success("Producto agregado con éxito", { autoClose: 2500 });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <form
        className="modal-content"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <div className="modal-inner-box">
          <h2>Agregar Nuevo Producto</h2>

          <div className="modal-form-content">
            <input
              type="text"
              placeholder="Nombre"
              {...register("name", {
                required: "El nombre es requerido",
                minLength: {
                  value: 3,
                  message: "Debe tener al menos 3 caracteres",
                },
              })}
            />
            {errors.name && <p className="error">{errors.name.message}</p>}

            <input
              type="number"
              step="0.01"
              placeholder="Precio"
              {...register("price", {
                required: "El precio es requerido",
                valueAsNumber: true,
                min: {
                  value: 0.01,
                  message: "El precio debe ser mayor a 0",
                },
              })}
            />
            {errors.price && <p className="error">{errors.price.message}</p>}

            <input
              type="number"
              placeholder="Stock"
              {...register("stock", {
                required: "El stock es requerido",
                valueAsNumber: true,
                min: {
                  value: 0,
                  message: "El stock no puede ser negativo",
                },
              })}
            />
            {errors.stock && <p className="error">{errors.stock.message}</p>}

            <input
              type="text"
              placeholder="Tipo de producto"
              {...register("productType", {
                required: "El tipo de producto es requerido",
              })}
            />
            {errors.productType && (
              <p className="error">{errors.productType.message}</p>
            )}

            <input
              type="text"
              placeholder="Tamaño"
              {...register("size", {
                required: "El tamaño es requerido",
              })}
            />
            {errors.size && <p className="error">{errors.size.message}</p>}

            <label>
              Color:
              <input
                type="color"
                {...register("color", { required: "El color es requerido" })}
                style={{
                  marginLeft: "8px",
                  cursor: "pointer",
                  width: "50px",
                  height: "30px",
                }}
              />
            </label>
            {errors.color && <p className="error">{errors.color.message}</p>}

            <label>
              Seleccionar imagen:
              <input
                type="file"
                accept="image/*"
                {...register("imageFile", {
                  required: "La imagen es obligatoria",
                })}
                onChange={(e) => {
                  setValue("imageFile", e.target.files);
                }}
              />
            </label>
            {errors.imageFile && (
              <p className="error">{errors.imageFile.message}</p>
            )}

            {imageFile && imageFile[0] && (
              <div className="image-preview">
                <img
                  src={URL.createObjectURL(imageFile[0])}
                  alt="Preview"
                  style={{ maxWidth: "150px" }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="modal-buttons">
          <button type="submit" className="save">
            Guardar
          </button>
          <button type="button" className="cancel" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductModal;
