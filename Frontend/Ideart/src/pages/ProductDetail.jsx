import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TopBar from "../components/TopBar";
import { useCart } from "../hooks/useCart";
import { useProductLocation } from "../hooks/useProductLocation";
import { useImageUpload } from "../hooks/useImageUpload";
import "../css/ProductDetail.css";

const ProductDetail = () => {
  const { nombre } = useParams(); // opcional, se mantiene por si se usa luego
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = useProductLocation();
  const { uploadedImage, handleImageUpload } = useImageUpload();

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  if (!product) return <p>Cargando producto...</p>;

  const { image, title, price } = product;

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert("Selecciona una talla y un color antes de continuar.");
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

    alert("Se añadió un producto nuevo al carrito");
    navigate("/products");
  };

  return (
    <>
      <TopBar />
      <Navbar />
      <div className="product-detail-container">
        <button onClick={() => navigate(-1)} className="back-button">← Regresar</button>
        <div className="product-detail-card">
          <div className="left-section">
            <img src={image} alt={title} className="main-image" />
            <div className="thumbnail-row">
              <img src={image} className="thumb" alt="thumb" />
              <img src={image} className="thumb" alt="thumb" />
              <div className="thumb extra">+3</div>
            </div>
            <h2>{title}</h2>
            <p className="description">
              Confeccionada en algodón suave de alta calidad, esta prenda es ideal para looks casuales, urbanos o para personalizar con tus propios diseños gracias a su superficie lisa y uniforme.
            </p>
          </div>

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
                      border: selectedColor === color.name ? "3px solid #333" : "1px solid #ccc",
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
              <input type="file" accept="image/*" onChange={handleImageUpload} />
              {uploadedImage && (
                <div className="preview">
                  <p>Vista previa:</p>
                  <img src={uploadedImage} alt="Referencia" style={{ width: "100px", marginTop: "10px" }} />
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
