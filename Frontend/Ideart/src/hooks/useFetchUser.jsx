// src/hooks/useUser.js
import { useState, useEffect, useCallback } from "react";

const API_URL = "http://localhost:5000/api/users";

const useUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Traer usuario desde backend
  const fetchUser = useCallback(async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_URL}/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Error al obtener usuario");

      const data = await res.json();
      setUser(data.user); // Guardamos en el estado
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // ---------------- UPDATE USER ----------------
  const updateUser = async (updatedData) => {
    if (!user) return null;
    const userId = user._id;
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Error al actualizar usuario");
      }

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
