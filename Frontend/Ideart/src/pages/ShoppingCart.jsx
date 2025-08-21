import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import Footer from "../components/Footer";
import TopBar from "../components/TopBar";
import Navbar from "../components/Navbar";
import "../css/ShoppingCart.css";

const ShoppingCart = () => {
  const {
    cartItems,
    removeFromCart,
    clearCart,
    getTotalItems,
    getTotalPrice,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const [promoCode, setPromoCode] = useState("");
  const navigate = useNavigate();

  const discountRate = 0.1;
  const subtotal = getTotalPrice();
  const discount = subtotal * discountRate;
  const total = subtotal - discount;

  // ✅ Guardar en favoritos en localStorage
  const handleSaveToFavorites = (item) => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];

    // Evitar duplicados
    const exists = savedFavorites.find((fav) => fav.id === item.id);
    if (!exists) {
      const newFavorites = [...savedFavorites, item];
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
      alert("Producto guardado en favoritos 🤍");
    } else {
      alert("Este producto ya está en tus favoritos");
    }
  };

  return (
    <>
      <TopBar />
      <Navbar />

      <div className="cart-page">
        <h2 className="cart-title">Carrito de Compras</h2>

        {cartItems.length === 0 ? (
          <p className="empty-cart">Tu carrito está vacío.</p>
        ) : (
          <>
            <div className="cart-summary">
              <p>Total de artículos: {getTotalItems()}</p>
              <p>Total a pagar: ${subtotal.toFixed(2)}</p>
              <button className="clear-cart-btn" onClick={clearCart}>
                Vaciar carrito
              </button>
            </div>

            <div className="cart-list">
              {cartItems.map((item, index) => (
                <div
                  key={index}
                  className={`cart-item ${
                    index === cartItems.length - 1 ? "last-item" : ""
                  }`}
                >
                  <div className="product-image">
                    <img src={item.image} alt={item.title} />
                  </div>

                  <div className="product-details">
                    <h3>{item.title}</h3>
                    <div className="price-stock">
                      <span>${Number(item.price).toFixed(2)}</span>
                      <span className="stock">| {item.stock || "En Stock"}</span>
                    </div>

                    <div className="selectors">
                      <select disabled value={item.size}>
                        <option>{item.size}</option>
                      </select>
                      <select disabled value={item.color}>
                        <option>{item.color}</option>
                      </select>

                      <div className="quantity-control">
                        <button
                          className="quantity-btn"
                          onClick={() => decreaseQuantity(index)}
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          className="quantity-btn"
                          onClick={() => increaseQuantity(index)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="product-actions">
                    <strong>
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </strong>
                    <div className="action-buttons">
                      <button
                        className="save-btn"
                        onClick={() => handleSaveToFavorites(item)}
                      >
                        🤍 Guardar
                      </button>
                      <button
                        className="remove-btn"
                        onClick={() => removeFromCart(index)}
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-summary">
              <h3>Resumen del Pedido</h3>
              <div className="promo">
                <input
                  type="text"
                  placeholder="Código de promoción"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button className="add-btn">Aplicar</button>
              </div>

              <div className="summary-line">
                <span>Sub Total</span>
                <strong>${subtotal.toFixed(2)}</strong>
              </div>
              <div className="summary-line">
                <span>Descuento (10%)</span>
                <strong>-${discount.toFixed(2)}</strong>
              </div>
              <div className="summary-line">
                <span>Total</span>
                <strong>${total.toFixed(2)}</strong>
              </div>

              <button className="buy-now" onClick={() => navigate("/checkout")}>
                Comprar Ahora
              </button>
            </div>
          </>
        )}
      </div>

      <Footer />
    </>
  );
};

export default ShoppingCart;
