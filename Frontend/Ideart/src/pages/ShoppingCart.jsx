// pages/ShoppingCart.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
// ✅ 1. Importamos el hook correcto que se conecta al backend
import { useShoppingCart } from "../hooks/useFetchShoppingCart.jsx";
import Footer from "../components/Footer";
import TopBar from "../components/TopBar";
import Navbar from "../components/Navbar";
import "../css/ShoppingCart.css";
import { useMemo } from "react"; // Para calcular totales de forma eficiente

const ShoppingCart = () => {
  // ✅ 2. Usamos el nuevo hook y obtenemos el estado del carrito, carga y error
  const { cart, loading, error, update, remove } = useShoppingCart();
  const navigate = useNavigate();

  // ✅ 3. Calculamos los totales a partir de los datos del hook.
  // Usamos useMemo para que no se recalcule en cada render, solo si el carrito cambia.
  const subtotal = useMemo(() => {
    if (!cart?.productos) return 0;
    return cart.productos.reduce(
      (total, item) => total + item.producto.price * item.cantidad,
      0
    );
  }, [cart]);

  const totalItems = useMemo(() => {
    if (!cart?.productos) return 0;
    return cart.productos.reduce((total, item) => total + item.cantidad, 0);
  }, [cart]);

  // Lógica para el descuento (puedes adaptarla según tu API)
  const discountRate = 0.1;
  const discount = subtotal * discountRate;
  const total = subtotal - discount;


  // ✅ 4. Adaptamos las funciones para que usen los métodos del hook
  
  // Función para cambiar la cantidad de un producto
  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1 || !cart) return; // No permitir cantidad menor a 1

    const updatedProductos = cart.productos.map(item =>
      item.producto._id === productId
        ? { ...item, cantidad: newQuantity }
        : item
    );
    // Llamamos a la función 'update' del hook para actualizar en la BD
    update(cart._id, { productos: updatedProductos });
  };
  
  // Función para eliminar un producto
  const handleRemoveProduct = (productId) => {
    if (!cart) return;

    const updatedProductos = cart.productos.filter(
      (item) => item.producto._id !== productId
    );
    // Llamamos a 'update' para guardar el cambio en la BD
    update(cart._id, { productos: updatedProductos });
  };
  
  // Función para vaciar el carrito
  const handleClearCart = () => {
    if (!cart) return;
    // Llamamos a 'remove' para eliminar el documento del carrito en la BD
    remove(cart._id);
  };
  
  // La función de favoritos sigue igual, ya que usa localStorage
  const handleSaveToFavorites = (producto) => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const exists = savedFavorites.find((fav) => fav._id === producto._id);
    if (!exists) {
      localStorage.setItem("favorites", JSON.stringify([...savedFavorites, producto]));
      alert("Producto guardado en favoritos 🤍");
    } else {
      alert("Este producto ya está en tus favoritos");
    }
  };

  // ✅ 5. Manejamos los estados de carga y error
  if (loading) {
    return <p className="cart-page-message">Cargando carrito...</p>;
  }

  if (error) {
    return <p className="cart-page-message">Error: {error}</p>;
  }

  return (
    <>
      <TopBar />
      <Navbar />

      <div className="cart-page">
        <h2 className="cart-title">Carrito de Compras</h2>

        {/* ✅ 6. Verificamos si el carrito no existe o no tiene productos */}
        {!cart || cart.productos.length === 0 ? (
          <p className="empty-cart">Tu carrito está vacío.</p>
        ) : (
          <>
            <div className="cart-summary">
              <p>Total de artículos: {totalItems}</p>
              <p>Total a pagar: ${subtotal.toFixed(2)}</p>
              <button className="clear-cart-btn" onClick={handleClearCart}>
                Vaciar carrito
              </button>
            </div>

            <div className="cart-list">
              {/* ✅ 7. Mapeamos `cart.productos` que viene de la BD */}
              {cart.productos.map(({ producto, cantidad }) => (
                <div key={producto._id} className="cart-item">
                  <div className="product-image">
                    <img src={producto.image} alt={producto.name} />
                  </div>
                  <div className="product-details">
                    <h3>{producto.name}</h3>
                    <div className="price-stock">
                      <span>${Number(producto.price).toFixed(2)}</span>
                      <span className="stock">| {producto.stock || "En Stock"}</span>
                    </div>
                    <div className="quantity-control">
                       <button
                         className="quantity-btn"
                         onClick={() => handleQuantityChange(producto._id, cantidad - 1)}
                         disabled={cantidad <= 1}
                       >
                         −
                       </button>
                       <span>{cantidad}</span>
                       <button
                         className="quantity-btn"
                         onClick={() => handleQuantityChange(producto._id, cantidad + 1)}
                       >
                         +
                       </button>
                     </div>
                  </div>

                  <div className="product-actions">
                    <strong>
                      ${(Number(producto.price) * cantidad).toFixed(2)}
                    </strong>
                    <div className="action-buttons">
                      <button className="save-btn" onClick={() => handleSaveToFavorites(producto)}>
                        🤍 Guardar
                      </button>
                      <button className="remove-btn" onClick={() => handleRemoveProduct(producto._id)}>
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-summary">
                <h3>Resumen del Pedido</h3>
                {/* La parte del resumen y promo code no necesita grandes cambios */}
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