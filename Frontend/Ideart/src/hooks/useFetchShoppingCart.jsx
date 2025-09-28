import { useState, useCallback } from "react";

const API_URL = "http://localhost:5000/api/carrito";

const useFetchShoppingCart = () => {
  const [carritos, setCarritos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL, { credentials: "include" });
      if (!res.ok) throw new Error(`Error al obtener carritos (${res.status})`);
      const data = await res.json();
      console.log("Respuesta backend getAll:", data); // 👈 verifica la estructura
      setCarritos(Array.isArray(data) ? data : data.carritos || []);
    } catch (err) {
      setError(err.message);
      setCarritos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const getById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/${id}`, { credentials: "include" });
      if (!res.ok) throw new Error(`Error al obtener carrito (${res.status})`);
      return await res.json();
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const create = async (newCarrito) => {
    setLoading(true);
    setError(null);
    try {
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

  const update = async (id, updatedCarrito) => {
    setLoading(true);
    setError(null);
    try {
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

  const remove = async (id) => {
    setLoading(true);
    setError(null);
    try {
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
    getById,
    create,
    update,
    remove,
    setCarritos,
  };
};

export default useFetchShoppingCart;
