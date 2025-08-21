// hooks/useFetchUser.jsx
import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "https://ideartdetallessv-1.onrender.com/api/users";

const useUser = (userId = null) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError("");

      try {
        let id = userId;

        // ✅ Si no hay userId, lo pedimos al backend con /auth/verify
        if (!id) {
          const verifyRes = await fetch("https://ideartdetallessv-1.onrender.com/api/auth/verify", {
            credentials: "include", // importante para cookies
          });
          const verifyData = await verifyRes.json();

          if (!verifyRes.ok || !verifyData.success) {
            throw new Error(verifyData.message || "Usuario no autenticado");
          }

          id = verifyData.user.id;
          localStorage.setItem("userId", id); // guardar para futuras sesiones
        }

        // ✅ Ahora pedimos el usuario
        const res = await fetch(`${API_URL}/${id}`, {
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Error al obtener usuario");

        // Algunos controladores devuelven { user: {...} }, otros {...}
        setUser(data.user || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const updateUser = (updatedUser) => setUser(updatedUser);

  return { user, setUser, loading, error, updateUser };
};

export default useUser;
