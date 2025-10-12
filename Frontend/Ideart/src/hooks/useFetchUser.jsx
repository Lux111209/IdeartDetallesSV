// src/hooks/useUser.js
import { useState, useEffect, useCallback } from "react";

const API_URL = "https://ideartdetallessv-1.onrender.com/users";

const useUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ------- OBTENER USUARIO LOGUEADO -------
  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_URL}/me/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 👈 token obligatorio
        },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Error al obtener usuario");

      const data = await res.json();
      setUser(data.user); // 👈 Ajusta según cómo responda tu backend
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // ------- ACTUALIZAR USUARIO -------
  const updateUser = async (updatedData) => {
    const token = localStorage.getItem("token");
    if (!user || !token) return null;

    try {
      const res = await fetch(`${API_URL}/me/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 👈 token obligatorio
        },
        body: JSON.stringify(updatedData),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Error al actualizar usuario");

      const data = await res.json();

      if (data.user) {
        setUser(data.user); // Actualizamos el estado
        return data.user;
      } else {
        console.warn("El backend no devolvió un usuario actualizado");
        return null;
      }
    } catch (err) {
      console.error("Error en updateUser:", err);
      return null;
    }
  };

  return { user, setUser, loading, error, fetchUser, updateUser };
};

export default useUser;
