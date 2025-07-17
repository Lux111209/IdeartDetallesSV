// hooks/useFetchUser.jsx
import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/users";

// Hook para manejar el usuario
const useUser = (userId) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setError("No hay ID de usuario");
      return;
    }
    // Función para obtener el usuario por ID
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/${userId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Error al obtener usuario");
        setUser(data.user);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Llamar a la función para obtener el usuario
    fetchUser();
  }, [userId]);

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return { user, setUser, loading, error, updateUser };
};

export default useUser;
