// hooks/useFetchLogin.js
import { useState, useCallback } from "react";

// Usa solo `import.meta.env` con fallback
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/login";

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ correo: email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error en login");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);

      setUser({ id: data.userId, token: data.token });
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return false;
    }
  }, []);

  return { login, loading, error, user };
};

export default useLogin;
