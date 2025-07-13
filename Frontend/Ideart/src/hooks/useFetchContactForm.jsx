import { useState } from "react";

const API_URL = "http://localhost:5000/api/users";

const useContactForm = () => {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState(false);

  const sendMessage = async (formData) => {
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error enviando mensaje");

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
