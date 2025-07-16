import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useFetchRecoverPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleRequestCode = async () => {
    if (!email) {
      setError("Por favor, ingrese su correo electrónico.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("http://localhost:4000/api/passwordRecovery/requestCode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "No se pudo enviar el correo de recuperación.");
      }

      const data = await response.json();
      setSuccessMessage(data.message || "Correo enviado con éxito.");
      localStorage.setItem("recoveryEmail", email);
      setTimeout(() => navigate("/CheckNumber"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    loading,
    error,
    successMessage,
    setEmail,
    handleRequestCode,
  };
};