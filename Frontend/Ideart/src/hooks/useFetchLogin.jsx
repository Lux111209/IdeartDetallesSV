// useFetchLogin.js
import { useState, useCallback } from "react";

const API_URL = "http://localhost:5000/api/login";

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [user, setUser]       = useState(null);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",  // para cookies httpOnly
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error en login");
      }

      setUser({ id: data.userId, token: data.token, message: data.message });
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
