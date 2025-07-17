import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TopBar from "../components/TopBar";
import { useCart } from "../hooks/useCart";
import { useProductLocation } from "../hooks/useProductLocation";
import { useImageUpload } from "../hooks/useImageUpload";
import Toast from "../components/Toast";
import "../css/ProductDetail.css";

const ProductDetail = () => {
  const { nombre } = useParams(); // Obtiene el parámetro de producto en URL
  const navigate = useNavigate();
  const { addToCart } = useCart(); // Función para agregar productos al carrito
  const product = useProductLocation(); // Obtiene datos del producto actual
  const { uploadedImage, handleImageUpload } = useImageUpload(); // Maneja la subida de imagen personalizada

  // Estados para seleccionar talla y color
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  // Estado para controlar el mensaje toast (alertas)
  const [toast, setToast] = useState({
    show: false,
    type: "info",
    message: "",
  });

  // Efecto para ocultar el toast automáticamente después de 3 segundos
  useEffect(() => {
    if (toast.show) {
      const id = setTimeout(() => setToast({ ...toast, show: false }), 3000);
      return () => clearTimeout(id);
    }
  }, [toast]);

  // Si no hay producto, muestra un mensaje de carga
  if (!product) return <p>Cargando producto...</p>;

  const { image, title, price } = product;

  // Maneja la acción de agregar producto al carrito con validación básica
  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      // Mostrar advertencia si falta seleccionar talla o color
      setToast({
        show: true,
        type: "warning",
        message: "Selecciona una talla y un color antes de continuar.",
      });
      return;
    }

    // Añade producto al carrito con las opciones seleccionadas y la imagen subida
    addToCart({
      title,
      image,
      price,
      size: selectedSize,
      color: selectedColor,
      quantity: 1,
      customImage: uploadedImage,
    });

    // Muestra mensaje de éxito
    setToast({
      show: true,
      type: "success",
      message: "¡Producto añadido al carrito!",
    });

    // Redirige a la página de productos después de 2.5 segundos
    setTimeout(() => {
      navigate("/products");
    }, 2500);
  };

  return (
    <>
      <TopBar />
      <Navbar />

      {/* Mostrar mensaje toast cuando está activo */}
      {toast.show && (
        <div className="toast-wrapper">
          <Toast type={toast.type} message={toast.message} />
        </div>
      )}

      <div className="product-detail-container">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Regresar
        </button>

        <div className="product-detail-card">
          {/* Sección izquierda: imagen, miniaturas y descripción */}
          <div className="left-section">
            <img src={image} alt={title} className="main-image" />
            <div className="thumbnail-row">
              <img src={image} className="thumb" alt="thumb" />
              <img src={image} className="thumb" alt="thumb" />
              <div className="thumb extra">+3</div>
            </div>
            <h2>{title}</h2>
            <p className="description">
              Producto de alta calidad, ideal para personalizar con tus diseños.
            </p>
          </div>

          {/* Sección derecha: opciones de talla, color, carga de imagen y añadir al carrito */}
          <div className="right-section">
            <h4>Tallas</h4>
            <div className="sizes">
              {["XS", "S", "M", "L", "XL"].map((size) => (
                <button
                  key={size}
                  className={selectedSize === size ? "selected" : ""}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>

            <div className="reviews">
              <h4>Reseñas</h4>
              <p>★★★★☆</p>
            </div>

            <div className="price">
              <h4>Precio</h4>
              <p>${price}</p>
            </div>

            <h4>Color</h4>
            <div className="color-dots">
              {[
                { name: "Negro", code: "#000000" },
                { name: "Blanco", code: "#ffffff" },
                { name: "Rojo", code: "#ff0000" },
                { name: "Azul", code: "#0000ff" },
              ].map((color) => (
                <span
                  key={color.name}
                  title={color.name}
                  className={`dot ${selectedColor === color.name ? "selected" : ""}`}
                  style={{
                    backgroundColor: color.code,
                    border:
                      selectedColor === color.name ? "3px solid #333" : "1px solid #ccc",
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    display: "inline-block",
                    cursor: "pointer",
                    margin: "5px",
                  }}
                  onClick={() => setSelectedColor(color.name)}
                />
              ))}
            </div>

            {/* Subida y vista previa de imagen personalizada */}
            <div className="custom-image-upload">
              <h4>Imagen de estampado o referencia</h4>
              <label className="upload-box">
                <span className="upload-label">
                  {uploadedImage ? "Cambiar imagen" : "Seleccionar archivo"}
                </span>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
              </label>

              {uploadedImage && (
                <div className="preview">
                  <p>Vista previa:</p>
                  <img src={uploadedImage} alt="Referencia" />
                </div>
              )}
            </div>

            {/* Botón para añadir al carrito */}
            <button className="add-to-cart" onClick={handleAddToCart}>
              Añadir carrito
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProductDetail;
