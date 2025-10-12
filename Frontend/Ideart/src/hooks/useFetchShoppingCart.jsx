import { useState, useCallback, useEffect } from "react";

const API_URL = "https://ideartdetallessv-1.onrender.com/carrito";

export function useShoppingCart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setCart(null); 
        throw new Error("No se encontró un ID de usuario en la sesión.");
      }

      const res = await fetch(`${API_URL}/usuario/${userId}`);
      if (res.status === 404) {
        setCart(null);
        return;
      }
      if (!res.ok) {
        throw new Error("Error al obtener el carrito del usuario.");
      }

      const data = await res.json();
      setCart(data);
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

  const create = async (newCartData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCartData),
      });
      if (!res.ok) throw new Error("Error al crear el carrito");
      await fetchUserCart();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const update = async (cartId, updatedData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/${cartId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) throw new Error("Error al actualizar el carrito");
      await fetchUserCart();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (cartId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/${cartId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar el carrito");
      setCart(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Vaciar carrito completamente para el usuario actual
  const clearCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("No se encontró un ID de usuario en la sesión.");
      const res = await fetch(`${API_URL}/vaciar/${userId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al vaciar el carrito");
      // Refresca el carrito para obtener el estado actualizado (vacío)
      await fetchUserCart();
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
    clearCart, // <-- ahora disponible
    refreshCart: fetchUserCart,
  };
}