import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/resenasgeneral';

export const useFetchGeneralReview = () => {
  const [resenas, setResenas] = useState([]);
  const [resena, setResena] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllResenas = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(API_URL);
      // Verificar que la respuesta tenga estructura esperada
      if (res.data && Array.isArray(res.data.data)) {
        setResenas(res.data.data);
      } else {
        throw new Error('Respuesta inesperada del servidor');
      }
    } catch (err) {
      // Manejo mejorado del error
      if (err.response) {
        setError(err.response.data.message || 'Error del servidor');
      } else if (err.request) {
        setError('No se pudo conectar con el servidor');
      } else {
        setError(err.message);
      }
      setResenas([]);
    } finally {
      setLoading(false);
    }
  };

  // Ejemplo: cargar las reseñas al montar el componente
  useEffect(() => {
    fetchAllResenas();
  }, []);

  return {
    resenas,
    resena,
    loading,
    error,
    fetchAllResenas,
  };
};
