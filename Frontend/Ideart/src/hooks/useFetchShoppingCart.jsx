// src/hooks/useShoppingCart.js
import { useState, useCallback, useEffect } from "react";

const API_URL = "http://localhost:5000/api/carrito";

export function useShoppingCart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener carrito del usuario
  const fetchUserCart = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        setCart(null);
        throw new Error("No hay usuario autenticado.");
      }

      const url = `${API_URL}/usuario/${userId}`;
      console.log("📡 Fetch carrito URL:", url);

      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (res.status === 404) {
        setCart(null); // Usuario aún no tiene carrito
        return;
      }

      if (!res.ok) throw new Error("Error al obtener el carrito del usuario.");

      const data = await res.json();
      setCart(data);
      console.log("✅ Carrito recibido:", data);
    } catch (err) {
      setError(err.message);
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserCart();
  }, [fetchUserCart]);

  // Crear carrito
  const create = async (newCartData) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCartData),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Error al crear el carrito");
      await fetchUserCart();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Actualizar carrito
  const update = async (cartId, updatedData) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/${cartId}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Error al actualizar el carrito");
      await fetchUserCart();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar carrito
  const remove = async (cartId) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/${cartId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Error al eliminar el carrito");
      setCart(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    cart,
    loading,
    error,
    create,
    update,
    remove,
    refreshCart: fetchUserCart,
  };
}
