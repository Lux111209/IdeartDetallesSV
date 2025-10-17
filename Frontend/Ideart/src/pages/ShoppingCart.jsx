import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useShoppingCart } from "../hooks/useFetchShoppingCart.jsx";
import Footer from "../components/Footer";
import TopBar from "../components/TopBar";
import Navbar from "../components/Navbar";
import "../css/ShoppingCart.css";

const ShoppingCart = () => {
  const { cart, loading, error, update, remove } = useShoppingCart();
  const navigate = useNavigate();

  // Calcula el subtotal
  const subtotal = useMemo(() => {
    if (!Array.isArray(cart?.products)) return 0;
    return cart.products.reduce(
      (total, item) => {
        // Si viene populado, usa item.idProducts como objeto, si no, como id
        const producto = typeof item.idProducts === "object" ? item.idProducts : item;
        return total + (producto?.price || 0) * item.cantidad;
      },
      0
    );
  }, [cart]);

  const totalItems = useMemo(() => {
    if (!Array.isArray(cart?.products)) return 0;
    return cart.products.reduce((total, item) => total + item.cantidad, 0);
  }, [cart]);

  const discountRate = 0.1;
  const discount = subtotal * discountRate;
  const total = subtotal - discount;

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1 || !cart || !Array.isArray(cart.products)) return;
    const updatedProducts = cart.products.map(item => {
      const producto = typeof item.idProducts === "object" ? item.idProducts : item;
      return (producto._id === productId)
        ? { ...item, cantidad: newQuantity }
        : item;
    });
    update(cart._id, { products: updatedProducts, idUser: cart.idUser, total: subtotal });
  };

  const handleRemoveProduct = (productId) => {
    if (!cart || !Array.isArray(cart.products)) return;
    const updatedProducts = cart.products.filter(item => {
      const producto = typeof item.idProducts === "object" ? item.idProducts : item;
      return producto._id !== productId;
    });
    update(cart._id, { products: updatedProducts, idUser: cart.idUser, total: subtotal });
  };

  const handleClearCart = () => {
    if (!cart) return;
    remove(cart._id);
  };

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

  if (loading) {
    return <p className="cart-page-message">Cargando carrito...</p>;
  }

  if (error) {
    return <p className="cart-page-message">Error: {error}</p>;
  }

  const isCartEmpty = !cart || !Array.isArray(cart.products) || cart.products.length === 0;

  return (
    <>
      <TopBar />
      <Navbar />

      <div className="cart-page">
        <h2 className="cart-title">Carrito de Compras</h2>

        {isCartEmpty ? (
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
              {cart.products.map((item) => {
                const producto = typeof item.idProducts === "object" ? item.idProducts : item;
                const cantidad = item.cantidad;
                return (
                  <div key={producto._id} className="cart-item">
                    <div className="product-image">
                      <img src={producto.image} alt={producto.name || producto.title} />
                    </div>
                    <div className="product-details">
                      <h3>{producto.name || producto.title}</h3>
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
                );
              })}
            </div>

            <div className="order-summary">
              <h3>Resumen del Pedido</h3>
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