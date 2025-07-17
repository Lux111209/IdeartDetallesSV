import React, { useState, useEffect } from "react"; // Importo React y hooks para estado y efectos
import { toast } from "react-toastify"; // Para mostrar mensajes toast de notificación
import "../css/ProductModal.css"; // Estilos específicos para este modal

// Componente modal para editar un producto
const ProductModal = ({ product, onClose, onSave, onDelete }) => {
  // Estado local para los datos del formulario
  const [formData, setFormData] = useState({
    name: "",          // Nombre del producto
    price: "",         // Precio
    stock: "",         // Cantidad en stock
    productType: "",   // Tipo de producto
    size: "",          // Tamaño
    color: "#000000",  // Color, con valor por defecto negro
    imageFile: null,   // Archivo de imagen (cuando el usuario sube una)
    imagePreview: null // URL para vista previa de la imagen
  });

  // Estado para manejar errores de validación
  const [errors, setErrors] = useState({});

  // useEffect que carga los datos del producto cuando cambia el prop `product`
  useEffect(() => {
    if (product) {
      // Seteo el formulario con los valores del producto recibido (o valores vacíos si no hay)
      setFormData({
        name: product.name || "",
        price: product.price || "",
        stock: product.stock || "",
        productType: product.productType || "",
        size: product.size || "",
        color: product.color || "#000000",
        imageFile: null, // Imagen nueva inicia como null
        imagePreview: product.images?.[0] || null, // Vista previa con la primera imagen si existe
      });
      setErrors({}); // Limpio errores al cargar producto
    }
  }, [product]);

  // Función para validar los datos del formulario antes de guardar
  const validate = () => {
    const newErrors = {};
    // Validaciones simples: que no estén vacíos o que tengan valores numéricos válidos
    if (!formData.name.trim()) newErrors.name = "El nombre es obligatorio";
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0)
      newErrors.price = "Precio inválido";
    if (!formData.stock || isNaN(formData.stock) || Number(formData.stock) < 0)
      newErrors.stock = "Stock inválido";
    if (!formData.productType.trim()) newErrors.productType = "Tipo es obligatorio";
    if (!formData.size.trim()) newErrors.size = "Tamaño es obligatorio";

    setErrors(newErrors); // Guardo errores para mostrarlos
    return Object.keys(newErrors).length === 0; // Retorno true si no hay errores
  };

  // Actualiza el estado del formulario cuando el usuario cambia un input
  const handleInputChange = (e) => {
    const { name, value } = e.target; // Obtengo el nombre y valor del input
    setFormData(prev => ({ ...prev, [name]: value })); // Actualizo solo el campo correspondiente
  };

  // Maneja la carga y vista previa de la imagen seleccionada
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Tomo el primer archivo seleccionado
    if (file) {
      setFormData(prev => ({
        ...prev,
        imageFile: file, // Guardo el archivo para uso futuro (por ejemplo, subirlo)
        imagePreview: URL.createObjectURL(file), // Creo URL temporal para mostrar vista previa
      }));
    }
  };

  // Cuando el usuario envía el formulario
  const handleSubmit = (e) => {
    e.preventDefault(); // Evito que recargue la página

    if (!validate()) { // Si no pasa validación
      toast.error("Por favor corrige los errores antes de guardar."); // Muestro error
      return; // Salgo sin guardar
    }

    // Armo el objeto actualizado para guardar
    const updatedProduct = {
      ...product, // Copio propiedades existentes
      name: formData.name.trim(),
      price: Number(formData.price),
      stock: Number(formData.stock),
      productType: formData.productType.trim(),
      size: formData.size.trim(),
      color: formData.color,
      images: [formData.imagePreview || "/images/placeholder.png"], // Imagen actual o placeholder
    };

    onSave(updatedProduct); // Llamo función para guardar cambios
    toast.success("Producto actualizado correctamente."); // Mensaje de éxito
  };

  return (
    // Fondo oscuro que cubre toda la pantalla y cierra modal al hacer click fuera
    <div className="modal-overlay" onClick={onClose}>
      {/* Formulario con contenido del modal, evito que click dentro cierre el modal */}
      <form
        className="modal-content"
        onSubmit={handleSubmit}
        onClick={e => e.stopPropagation()}
        noValidate // Deshabilito validaciones HTML por defecto para usar las propias
      >
        <h2>Editar Producto</h2>

        <div className="modal-form-content">
          {/* Inputs con sus valores controlados y mensajes de error */}
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

          {/* Selector de color */}
          <input
            type="color"
            name="color"
            value={formData.color}
            onChange={handleInputChange}
            title="Selecciona un color"
            style={{ width: "50px", height: "30px", cursor: "pointer" }}
          />

          {/* Input para subir imagen */}
          <label style={{ marginTop: "10px" }}>
            Seleccionar imagen:
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </label>

          {/* Vista previa de la imagen cargada */}
          {formData.imagePreview && (
            <div className="image-preview">
              <img src={formData.imagePreview} alt="Preview" />
            </div>
          )}
        </div>

        {/* Botones para guardar, eliminar o cancelar */}
        <div className="modal-buttons">
          <button type="submit" className="save">
            Guardar
          </button>
          <button
            type="button"
            className="cancel"
            onClick={() => {
              onDelete(product._id); // Llamo función para eliminar producto
              onClose(); // Cierro modal
            }}
          >
            Eliminar
          </button>
          <button type="button" className="cancel" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductModal; // Exporto el componente para usarlo en otras partes
