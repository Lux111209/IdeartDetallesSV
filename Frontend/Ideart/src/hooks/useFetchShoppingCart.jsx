import { useState, useCallback } from "react";

const API_URL = "https://ideartdetallessv-1.onrender.com/api/carrito";

const useFetchShoppingCart = () => {
  const [carritos, setCarritos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ===== OBTENER TODOS LOS CARRITOS =====
  const getAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(API_URL, { credentials: "include" });
      if (!res.ok) throw new Error(`Error al obtener carritos (${res.status})`);
      const data = await res.json();
      setCarritos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // ===== CREAR UN NUEVO CARRITO =====
  const create = async (newCarrito) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCarrito),
        credentials: "include",
      });
      if (!res.ok) {
        const errMsg = await res.json();
        throw new Error(errMsg.message || "Error al crear carrito");
      }
      await getAll();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ===== ACTUALIZAR UN CARRITO =====
  const update = async (id, updatedCarrito) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCarrito),
        credentials: "include",
      });
      if (!res.ok) {
        const errMsg = await res.json();
        throw new Error(errMsg.message || "Error al actualizar carrito");
      }
      await getAll();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ===== ELIMINAR UN CARRITO =====
  const remove = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const errMsg = await res.json();
        throw new Error(errMsg.message || "Error al eliminar carrito");
      }
      await getAll();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    carritos,
    loading,
    error,
    getAll,
    create,
    update,
    remove,
    setCarritos,
  };
};

export default useFetchShoppingCart;
