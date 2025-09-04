import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 para redirigir
import "../css/LoginPriv.css";

const LoginPriv = () => {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Función que maneja el envío del formulario
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // 🔹 Validaciones frontend
    if (!correo.trim()) {
      setError("El correo es obligatorio");
      return;
    }
    if (!password.trim()) {
      setError("La contraseña es obligatoria");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      setError("Formato de correo inválido");
      return;
    }

    try {
      // 🔹 Llamada al backend
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ correo, password }),
      });

      const data = await res.json();

      // 🔹 Manejo de errores devueltos por el backend
      if (!res.ok) {
        setError(data.message || "Error al iniciar sesión");
        return;
      }

      // 🔹 Guardar token y expiración en localStorage
      const token = data.token || "usuarioAutenticado"; // si tu backend devuelve JWT úsalo
      const expiry = new Date().getTime() + 30 * 60 * 1000; // 30 minutos

      localStorage.setItem("token", token);
      localStorage.setItem("expiry", expiry.toString());

      // 🔹 Mensaje de bienvenida
      setSuccess(
        `Bienvenido, ${data.userType === "admin" ? "Administrador" : "Usuario"}`
      );

      // 🔹 Redirigir al dashboard después de 1s
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);

    } catch (err) {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <img src="/ideartL.png" alt="Logo" className="logo" />
        <img src="/persona.png" alt="Illustration" className="illustration" />
      </div>
      <div className="login-right">
        <h2 className="login-title">Iniciar sesión</h2>
        <p className="login-subtitle">Accede a tu cuenta</p>
        <form className="login-form" onSubmit={handleLogin}>
          {/* Mensajes de error y éxito */}
          {error && <p style={{ color: "red", fontSize: "0.85rem" }}>{error}</p>}
          {success && (
            <p style={{ color: "green", fontSize: "0.85rem" }}>{success}</p>
          )}

          {/* Inputs */}
          <input
            type="email"
            placeholder="Correo electrónico"
            className="login-input"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-button">
            Iniciar
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPriv;
