// src/hooks/useFetchProducts.js
import { useEffect, useState } from 'react';

const useFetchProducts = () => {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const getProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      if (!response.ok) {
        alert('Error al traer los productos');
        return;
      }
      const data = await response.json();
      setProducts(data);
      console.log('Productos recibidos:', data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

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
