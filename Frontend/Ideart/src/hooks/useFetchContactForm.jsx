import { useState } from "react";
// Hook para manejar el formulario de contacto
const API_URL = "https://ideartdetallessv-1.onrender.com/api/users";

const useContactForm = () => {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState(false);

  // Función para enviar el mensaje del formulario
  const sendMessage = async (formData) => {
    setLoading(true);
    setError("");
    setSuccess(false);

    // Validación básica del formulario
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error enviando mensaje");

      // Si el envío es exitoso, resetea el formulario y muestra un mensaje de éxito
      setSuccess(true);
      return data; // { message: "Mensaje recibido" }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, success, sendMessage };
};

export default useContactForm;
