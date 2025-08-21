// src/hooks/useFetchProducts.js
import { useEffect, useState } from 'react';

// Hook para obtener productos desde la API
const useFetchProducts = () => {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Función para obtener productos
  const getProducts = async () => {
    try {
      const response = await fetch('https://ideartdetallessv-1.onrender.com/api/products');
      if (!response.ok) {
        alert('Error al traer los productos');
        return;
      }
      const data = await response.json();
      setProducts(data.data);
      console.log('Productos recibidos:', data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Cargar productos al montar el componente
  useEffect(() => {
    getProducts();
  }, []);

  return {
    products,
    setProducts,
    loadingProducts,
  };
};

export default useFetchProducts;
