import { useState, useCallback } from "react";

const API_URL = "http://localhost:5000/api/registerUser";

// Hook para manejar el registro de usuarios
const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState(false);

  // Función para manejar el registro
  const register = useCallback(async (userData) => {
    setLoading(true);
    setError("");
    setSuccess(false);

    // Validación básica del formulario
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Necesario para enviar la cookie con el token
        body: JSON.stringify(userData),
      });

      // Verifica si la respuesta es exitosa
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error en registro");
      }

      // El backend devuelve token (opcional), pero ya se guarda en cookie
      setSuccess(true);
      setLoading(false);
      return { success: true, token: data.token };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false };
    }
  }, []);

  return { register, loading, error, success };
};

export default useRegister;
