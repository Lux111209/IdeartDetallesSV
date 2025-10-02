import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TopBar from "../components/TopBar";
import { useProductLocation } from "../hooks/useProductLocation";
import { useImageUpload } from "../hooks/useImageUpload";
import Toast from "../components/Toast";
import { useShoppingCart } from "../hooks/useFetchShoppingCart";
import "../css/ProductDetail.css";

const ProductDetail = () => {
  const { nombre } = useParams();
  const { cart, create, update } = useShoppingCart();
  const navigate = useNavigate();
  const product = useProductLocation();
  const { uploadedImage, handleImageUpload } = useImageUpload();

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [toast, setToast] = useState({
    show: false,
    type: "info",
    message: "",
  });

  useEffect(() => {
    if (toast.show) {
      const id = setTimeout(() => setToast({ ...toast, show: false }), 3000);
      return () => clearTimeout(id);
    }
  }, [toast]);

  if (!product) return <p>Cargando producto...</p>;

  const { image, title, price } = product;

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      setToast({
        show: true,
        type: "warning",
        message: "Selecciona una talla y un color antes de continuar.",
      });
      return;
    }

    if (!product._id) {
      setToast({
        show: true,
        type: "error",
        message: "Error interno: el producto no tiene un ID válido.",
      });
      return;
    }

    const productoParaCarrito = {
      idProducts: product._id,
      size: selectedSize,
      color: selectedColor,
      customImage: uploadedImage,
      cantidad: 1
    };

    if (cart && Array.isArray(cart.products) && cart.products.length > 0) {
      const existe = cart.products.find(
        (item) => item.idProducts?._id === product._id || item.idProducts === product._id
      );
      let nuevosProductos;
      if (existe) {
        nuevosProductos = cart.products.map((item) =>
          (item.idProducts?._id === product._id || item.idProducts === product._id)
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        nuevosProductos = [
          ...cart.products,
          productoParaCarrito
        ];
      }
      const nuevoTotal = nuevosProductos.reduce((sum, item) => {
        const precio = item.idProducts?.price || product.price;
        return sum + (precio || 0) * item.cantidad;
      }, 0);

      await update(cart._id, {
        products: nuevosProductos,
        idUser: localStorage.getItem("userId"),
        total: nuevoTotal
      });
    } else if (cart) {
      await update(cart._id, {
        products: [productoParaCarrito],
        idUser: localStorage.getItem("userId"),
        total: product.price
      });
    } else {
      await create({
        products: [
          {
            idProducts: product._id,
            cantidad: 1,
            size: selectedSize,
            color: selectedColor,
            customImage: uploadedImage
          }
        ],
        idUser: localStorage.getItem("userId"),
        total: product.price
      });
    }

    setToast({
      show: true,
      type: "success",
      message: "¡Producto añadido al carrito!",
    });

    setTimeout(() => {
      navigate("/shoppingcart");
    }, 1500);
  };

  return (
    <>
      <TopBar />
      <Navbar />

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