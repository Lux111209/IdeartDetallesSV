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
  const { nombre } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = useProductLocation();
  const { uploadedImage, handleImageUpload } = useImageUpload();

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const [toast, setToast] = useState({
    show: false,
    type: "info",
    message: "",
  });

  // Ocultar el toast automáticamente
  useEffect(() => {
    if (toast.show) {
      const id = setTimeout(() => setToast({ ...toast, show: false }), 3000);
      return () => clearTimeout(id);
    }
  }, [toast]);

  if (!product) return <p>Cargando producto...</p>;

  const { image, title, price } = product;

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      setToast({
        show: true,
        type: "warning",
        message: "Selecciona una talla y un color antes de continuar.",
      });
      return;
    }

    addToCart({
      title,
      image,
      price,
      size: selectedSize,
      color: selectedColor,
      quantity: 1,
      customImage: uploadedImage,
    });

    setToast({
      show: true,
      type: "success",
      message: "¡Producto añadido al carrito!",
    });

    setTimeout(() => {
      navigate("/products");
    }, 2500); // Espera antes de redirigir
  };

  return (
    <>
      <TopBar />
      <Navbar />

      {/* Alerta Toast */}
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
          {/* Lado izquierdo */}
          <div className="left-section">
            <img src={image} alt={title} className="main-image" />
            <div className="thumbnail-row">
              <img src={image} className="thumb" alt="thumb" />
              <img src={image} className="thumb" alt="thumb" />
              <div className="thumb extra">+3</div>
            </div>
            <h2>{title}</h2>
            <p className="description">
              Confeccionada en algodón suave de alta calidad, esta prenda es
              ideal para looks casuales, urbanos o para personalizar con tus
              propios diseños gracias a su superficie lisa y uniforme.
            </p>
          </div>

          {/* Lado derecho */}
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

            <div className="colors">
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
                        selectedColor === color.name
                          ? "3px solid #333"
                          : "1px solid #ccc",
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
            </div>

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
