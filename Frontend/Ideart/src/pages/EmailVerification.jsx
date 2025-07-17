// EmailVerification.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast";
import "../css/Login.css"; // reutiliza estilos del login

const EmailVerification = () => {
  // Guarda el código que el usuario escribe
  const [code, setCode] = useState("");
  // Estado para mostrar mensajes de éxito o error
  const [toast, setToast] = useState(null);
  // Hook para redireccionar a otra página
  const navigate = useNavigate();

  // Función que maneja el envío del código para verificar
  const handleVerify = async (e) => {
    e.preventDefault();

    // Valida que el código tenga al menos 6 caracteres
    if (!code || code.trim().length < 6) {
      return setToast({ type: "error", message: "Ingresa un código válido." });
    }

    try {
      // Envía el código al backend para validar
      const response = await fetch("http://localhost:5000/api/registerUser/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // incluye cookies si las hay
        body: JSON.stringify({ verificationCode: code }),
      });

      const data = await response.json();

      // Si la verificación es correcta, muestra éxito y redirige al login
      if (response.ok) {
        setToast({ type: "success", message: data.message });
        setTimeout(() => navigate("/login"), 1500);
      } else {
        // Si hay error, muestra mensaje correspondiente
        setToast({ type: "error", message: data.message || "Error al verificar." });
      }
    } catch (err) {
      // En caso de fallo de conexión, muestra error genérico
      setToast({ type: "error", message: "Error de conexión con el servidor." });
    }
  };

  return (
    <div className="container">
      {/* Sección decorativa izquierda */}
      <div className="left" />
      {/* Sección derecha con formulario */}
      <div className="right">
        <h1 className="title">Verifica tu Correo</h1>

        {/* Formulario para ingresar y enviar código */}
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

          {/* Muestra toast con mensajes de éxito o error */}
          {toast && <Toast type={toast.type} message={toast.message} />}

          {/* Texto para reenviar código, con espacio para implementar */}
          <div className="link">
            ¿No recibiste el código?{" "}
            <strong style={{ color: "#d92d20" }}>Reenviar</strong>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailVerification;
