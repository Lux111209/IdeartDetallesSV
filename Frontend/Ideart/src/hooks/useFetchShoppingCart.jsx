import { useEffect, useState, useCallback } from "react";

const API_URL = "http://localhost:5000/api/carrito";

// Hook para obtener y manejar el carrito de compras
const useFetchShoppingCart = () => {
  const [carritos, setCarritos] = useState([]);
  const [carrito, setCarrito] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Obtener todos los carritos
  const getAll = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Error al obtener los carritos");
      const data = await res.json();
      setCarritos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener un carrito por ID
  const getById = useCallback(async (id) => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id}`);
      if (!res.ok) throw new Error("Error al obtener el carrito");
      const data = await res.json();
      setCarrito(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear un carrito
  const create = useCallback(async (carritoData) => {
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(carritoData),
      });
      if (!res.ok) throw new Error("Error al crear el carrito");
      const data = await res.json();
      return data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar un carrito
  const update = useCallback(async (id, carritoData) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(carritoData),
      });
      if (!res.ok) throw new Error("Error al actualizar el carrito");
      const data = await res.json();
      return data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Eliminar un carrito
  const remove = useCallback(async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar el carrito");
      const data = await res.json();
      return data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getAll();
  }, [getAll]);

  return {
    carritos,
    carrito,
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
