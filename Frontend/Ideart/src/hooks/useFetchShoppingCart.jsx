import React, { useEffect, useState } from "react";
import useFetchShoppingCart from "../hooks/useFetchShoppingCart";
import "../css/ShoppingCart.css";

const ShoppingCart = () => {
  const { carritos, loading, error, getAll, update, remove, setCarritos } =
    useFetchShoppingCart();

  const [total, setTotal] = useState(0);

  // Cargar carrito desde el backend
  useEffect(() => {
    getAll();
  }, [getAll]);

  // Calcular total
  useEffect(() => {
    if (carritos.length > 0) {
      let suma = 0;
      carritos.forEach((cart) => {
        cart.products.forEach((p) => {
          suma += (p.idProducts?.price || 0) * p.cantidad;
        });
      });
      setTotal(suma);
    } else {
      setTotal(0);
    }
  }, [carritos]);

  const handleRemoveItem = async (cartId, prodId) => {
    // Actualizar el carrito en la BD
    const cart = carritos.find((c) => c._id === cartId);
    const newProducts = cart.products.filter(
      (p) => p.idProducts?._id !== prodId
    );

    await update(cartId, { products: newProducts });
    getAll();
  };

  const handleClearCart = async (cartId) => {
    await update(cartId, { products: [] });
    getAll();
  };

  if (loading) return <p>Cargando carrito...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="cart-page">
      <h2 className="cart-title">🛒 Mi Carrito</h2>

      {carritos.length === 0 || carritos[0].products.length === 0 ? (
        <p className="empty-cart">Tu carrito está vacío</p>
      ) : (
        <>
          {/* Resumen de carrito */}
          <div className="cart-summary">
            <span>Total de artículos: {carritos[0].products.length}</span>
            <span>
              Total a pagar: <strong>${total}</strong>
            </span>
            <button
              className="clear-cart-btn"
              onClick={() => handleClearCart(carritos[0]._id)}
            >
              Vaciar carrito
            </button>
          </div>

          {/* Lista de productos */}
          <div className="cart-list">
            {carritos[0].products.map((p, i) => (
              <div key={i} className="cart-item">
                <div className="product-image">
                  <img
                    src={p.idProducts?.image || "/placeholder.png"}
                    alt={p.idProducts?.name || "Producto"}
                  />
                </div>

                <div className="product-details">
                  <h3>{p.idProducts?.name || "Producto sin nombre"}</h3>
                  <div className="price-stock">
                    Precio: ${p.idProducts?.price || 0}
                    <span className="stock">
                      Stock: {p.idProducts?.stock || 0}
                    </span>
                  </div>
                  <div className="quantity-control">
                    <button className="quantity-btn">-</button>
                    <span>{p.cantidad}</span>
                    <button className="quantity-btn">+</button>
                  </div>
                </div>

                <div className="product-actions">
                  <div className="action-buttons">
                    <button
                      className="remove-btn"
                      onClick={() =>
                        handleRemoveItem(carritos[0]._id, p.idProducts?._id)
                      }
                    >
                      ❌ Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="order-summary">
            <h3>Resumen de compra</h3>
            <div className="summary-line">
              <span>Subtotal</span>
              <span>${total}</span>
            </div>
            <div className="summary-line">
              <span>Envío</span>
              <span>Gratis</span>
            </div>
            <div className="summary-line">
              <strong>Total</strong>
              <strong>${total}</strong>
            </div>
            <button className="buy-now">Comprar Ahora</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ShoppingCart;
