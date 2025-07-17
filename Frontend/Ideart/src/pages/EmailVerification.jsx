// EmailVerification.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast";
import "../css/Login.css"; // reutilizamos estilos

const EmailVerification = () => {
  const [code, setCode] = useState("");
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!code || code.trim().length < 6) {
      return setToast({ type: "error", message: "Ingresa un código válido." });
    }

    try {
      const response = await fetch("http://localhost:5000/api/registerUser/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ verificationCode: code }),
      });

      const data = await response.json();

      if (response.ok) {
        setToast({ type: "success", message: data.message });
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setToast({ type: "error", message: data.message || "Error al verificar." });
      }
    } catch (err) {
      setToast({ type: "error", message: "Error de conexión con el servidor." });
    }
  };

  return (
    <div className="container">
      <div className="left" />
      <div className="right">
        <h1 className="title">Verifica tu Correo</h1>
        <form className="form" onSubmit={handleVerify}>
          <input
            type="text"
            className="input"
            placeholder="Ingresa el código recibido por email"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <button type="submit" className="button">
            Verificar
          </button>
          {toast && <Toast type={toast.type} message={toast.message} />}
          <div className="link">
            ¿No recibiste el código? <strong style={{ color: "#d92d20" }}>Reenviar</strong>
            {/* Aquí podrías agregar lógica para reenviar el código */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailVerification;
