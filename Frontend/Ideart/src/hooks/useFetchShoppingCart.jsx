// hooks/useShoppingCart.js
import { useState, useCallback, useEffect } from "react";

const API_URL = "http://localhost:5000/api/carrito";

export function useShoppingCart() {
  // 1. El estado ahora es 'cart' (un objeto), no 'carritos' (un array)
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Función central para obtener el carrito del usuario logueado
  const fetchUserCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        // Si no hay usuario, no hay carrito que mostrar.
        setCart(null); 
        throw new Error("No se encontró un ID de usuario en la sesión.");
      }

      const res = await fetch(`${API_URL}/usuario/${userId}`);
      
      // Si el usuario no tiene un carrito aún, la API puede devolver 404.
      if (res.status === 404) {
        setCart(null); // No es un error, simplemente no tiene carrito.
        return;
      }

      if (!res.ok) {
        throw new Error("Error al obtener el carrito del usuario.");
      }

      const data = await res.json();
      setCart(data);
    } catch (err) {
      setError(err.message);
      setCart(null); // Limpiamos el carrito en caso de error
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. useEffect para cargar el carrito cuando el hook se usa por primera vez
  useEffect(() => {
    fetchUserCart();
  }, [fetchUserCart]);


  // 4. Las funciones CRUD ahora llaman a fetchUserCart() para actualizar el estado
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
      
      await fetchUserCart(); // Refresca el estado con el carrito recién creado
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

      await fetchUserCart(); // Refresca el estado del carrito
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

      setCart(null); // Actualización optimista: lo borramos de la UI inmediatamente
      // fetchUserCart(); Opcional: podrías volver a llamar para re-sincronizar, pero con setCart(null) es suficiente.
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