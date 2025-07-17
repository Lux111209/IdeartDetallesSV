import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import Footer from "../components/Footer";
import TopBar from "../components/TopBar";
import Navbar from "../components/Navbar";
import "../css/ShoppingCart.css";

const ShoppingCart = () => {
  // Obtenemos funciones y datos del carrito usando custom hook
  const {
    cartItems,
    removeFromCart,
    clearCart,
    getTotalItems,
    getTotalPrice,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  // Estado para el código promocional (aún no funcional)
  const [promoCode, setPromoCode] = useState("");
  const navigate = useNavigate();

  // Cálculo de descuento fijo del 10%
  const discountRate = 0.1;
  const subtotal = getTotalPrice();
  const discount = subtotal * discountRate;
  const total = subtotal - discount;

  return (
    <>
      <TopBar />
      <Navbar />
      
      <div className="cart-page">
        <h2 className="cart-title">Carrito de Compras</h2>

        {/* Mensaje si el carrito está vacío */}
        {cartItems.length === 0 ? (
          <p className="empty-cart">Tu carrito está vacío.</p>
        ) : (
          <>
            {/* Resumen rápido: total artículos y subtotal */}
            <div className="cart-summary">
              <p>Total de artículos: {getTotalItems()}</p>
              <p>Total a pagar: ${subtotal.toFixed(2)}</p>
              <button className="clear-cart-btn" onClick={clearCart}>
                Vaciar carrito
              </button>
            </div>

            {/* Lista de productos en el carrito */}
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

                  {/* Detalles del producto */}
                  <div className="product-details">
                    <h3>{item.title}</h3>
                    <div className="price-stock">
                      <span>${Number(item.price).toFixed(2)}</span>
                      <span className="stock">| {item.stock || "En Stock"}</span>
                    </div>

                    {/* Selección de talla y color (fijos, solo muestran) */}
                    <div className="selectors">
                      <select disabled value={item.size}>
                        <option>{item.size}</option>
                      </select>
                      <select disabled value={item.color}>
                        <option>{item.color}</option>
                      </select>

                      {/* Control de cantidad con botones + y - */}
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

                  {/* Acciones del producto: precio total, guardar o eliminar */}
                  <div className="product-actions">
                    <strong>
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </strong>
                    <div className="action-buttons">
                      <button className="save-btn">🤍 Guardar</button>
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

            {/* Resumen final del pedido con promo, subtotal, descuento y total */}
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

              {/* Botón para continuar al checkout */}
              <button
                className="buy-now"
                onClick={() => navigate("/checkout")}
              >
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
