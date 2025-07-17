import { useEffect, useState } from 'react';

const useFetchOfertas = () => {
  const [ofertas, setOfertas] = useState([]);
  const [loadingOfertas, setLoadingOfertas] = useState(true);

  const getOfertas = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/ofertas', {
        credentials: 'include',
      });
      if (!response.ok) {
        alert('Error al traer las ofertas');
        return;
      }
      const data = await response.json();
      setOfertas(data);
      console.log('Ofertas recibidas:', data);
    } catch (error) {
      console.error('Error al obtener ofertas:', error);
    } finally {
      setLoadingOfertas(false);
    }
  };

  useEffect(() => {
    getOfertas();
  }, []);

  return {
    ofertas,
    setOfertas,
    loadingOfertas,
  };
};

export default useFetchOfertas;