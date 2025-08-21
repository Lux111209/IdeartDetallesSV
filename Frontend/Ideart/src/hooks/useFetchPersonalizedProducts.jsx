import { useEffect, useState, useCallback } from 'react';

const API_URL = 'https://ideartdetallessv-1.onrender.com/api/productPersonalized';

const useFetchPersonalizedProducts = () => {
  const [items, setItems] = useState([]);    // Lista de productos personalizados
  const [item, setItem] = useState(null);    // Un producto por ID
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Obtener todos los productos personalizados
  const getAll = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Error al obtener productos personalizados');
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener un producto personalizado por ID
  const getById = useCallback(async (id) => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id}`);
      if (!res.ok) throw new Error('Error al obtener el producto personalizado');
      const data = await res.json();
      setItem(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carga automática de todos los productos al montar el hook
  useEffect(() => {
    getAll();
  }, [getAll]);

  return {
    items,
    item,
    loading,
    error,
    getAll,
    getById,
    setItems,
  };
};

export default useFetchPersonalizedProducts;
