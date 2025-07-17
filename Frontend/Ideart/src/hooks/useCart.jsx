import React, { createContext, useContext, useState, useEffect } from "react";

// Contexto para el carrito de compras
const CartContext = createContext();

// Proveedor del contexto del carrito
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // Guarda el carrito en localStorage cada vez que cambia
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Funciones para manipular el carrito
  const addToCart = (item) => {
    const existingIndex = cartItems.findIndex(
      (i) =>
        i.title === item.title &&
        i.size === item.size &&
        i.color === item.color
    );

    // Si el item ya existe, incrementa la cantidad
    if (existingIndex !== -1) {
      const updatedCart = [...cartItems];
      updatedCart[existingIndex].quantity += item.quantity;
      setCartItems(updatedCart);
    } else {
      setCartItems([...cartItems, item]);
    }
  };

  // Funciones para manipular los items del carrito
  const removeFromCart = (index) => {
    const updatedCart = [...cartItems];
    updatedCart.splice(index, 1);
    setCartItems(updatedCart);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Funciones para aumentar y disminuir la cantidad de un item
  const increaseQuantity = (index) => {
    const updatedCart = [...cartItems];
    updatedCart[index].quantity += 1;
    setCartItems(updatedCart);
  };

  // Disminuye la cantidad de un item, pero no permite que sea menor a 1
  const decreaseQuantity = (index) => {
    const updatedCart = [...cartItems];
    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
      setCartItems(updatedCart);
    }
  };

  // Obtiene el total de items y el total del precio del carrito
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };
  // Proporciona el contexto del carrito a los componentes hijos
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        increaseQuantity,
        decreaseQuantity,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook para usar el carrito
export const useCart = () => {
  return useContext(CartContext);
};