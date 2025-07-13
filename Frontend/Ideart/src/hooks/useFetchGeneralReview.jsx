import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/resenasgeneral';

export const useFetchGeneralReview = () => {
  const [resenas, setResenas] = useState([]);
  const [resena, setResena] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener todas las reseñas generales
  const fetchAllResenas = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(API_URL);
      console.log('Respuesta del backend:', res.data);

      // Verificamos que la respuesta contenga el array esperado
      const data = res.data?.data;
      if (Array.isArray(data)) {
        setResenas(data);
      } else {
        setError('Respuesta inesperada del servidor');
        setResenas([]);
      }
    } catch (err) {
      console.error('Error al obtener reseñas:', err);
      setError(err.response?.data?.message || 'Error al obtener reseñas');
      setResenas([]);
    } finally {
      setLoading(false);
    }
  };

  // Otros métodos pueden seguir igual...

  return {
    resenas,
    resena,
    loading,
    error,
    fetchAllResenas
    // Puedes agregar aquí otros métodos como fetchResenaById, etc.
  };
};
