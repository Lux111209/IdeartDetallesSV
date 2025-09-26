// src/hooks/usePayment.jsx
import { useState } from "react";

export const usePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [paymentResponse, setPaymentResponse] = useState(null);

  // 🔹 1. Obtener token desde tu backend
  const getToken = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("http://localhost:5000/api/payment/token", {
        method: "POST",
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Error al obtener token");
      }

      const data = await res.json();
      setToken(data.access_token);
      return data.access_token;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 2. Pago de prueba (sin 3DS)
  const testPayment = async (formData) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("http://localhost:5000/api/payment/testPayment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, formData }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Error en el pago de prueba");
      }

      const data = await res.json();
      setPaymentResponse(data);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 3. Pago real con 3DS
  const payment3ds = async (formData) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("http://localhost:5000/api/payment/payment3ds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, formData }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || "Error en el pago 3DS");
      }

      const data = await res.json();
      setPaymentResponse(data);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 4. Flujo completo para iniciar y pagar
  const handlePay = async (formData, with3ds = false) => {
    let activeToken = token;

    // Si no hay token en memoria, lo obtenemos primero
    if (!activeToken) {
      activeToken = await getToken();
      if (!activeToken) return;
    }

    if (with3ds) {
      return await payment3ds(formData);
    } else {
      return await testPayment(formData);
    }
  };

  return {
    loading,
    error,
    token,
    paymentResponse,
    getToken,
    testPayment,
    payment3ds,
    handlePay,
  };
};

export default usePayment;
