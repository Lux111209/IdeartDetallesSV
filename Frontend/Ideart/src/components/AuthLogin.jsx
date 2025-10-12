// src/components/AuthLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "./Toast";
import "../css/Login.css";

const AuthLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return setToast({ type: "error", message: "Todos los campos son obligatorios." });
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return setToast({ type: "error", message: "Correo no válido." });
    }

    try {
      setLoading(true);
      const res = await fetch("https://ideartdetallessv-1.onrender.com/login/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: email, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setToast({ type: "error", message: data.message || "Credenciales incorrectas." });
        setLoading(false);
        return;
      }

      // Guardar token y userId
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("userType", data.userType);

      setToast({ type: "success", message: "Inicio de sesión exitoso." });

      setTimeout(() => navigate("/profile"), 1000);

    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Error de conexión con el servidor" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <img src="./ideartL.png" alt="Logo" className="logo" />
        <img src="/persona.jpeg" alt="Illustration" className="illustration" />
      </div>
      <div className="login-right">
        <h2 className="login-title">Iniciar sesión</h2>
        <p className="login-subtitle">Accede a tu cuenta</p>
        <form className="login-form" onSubmit={handleSubmit}>
          {toast && <Toast type={toast.type} message={toast.message} />}
          <input
            type="email"
            placeholder="Correo electrónico"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Cargando..." : "Iniciar"}
          </button>
          <div className="link">
            ¿Olvidaste tu contraseña?{" "}
            <strong
              style={{ cursor: "pointer", color: "#e91e63" }}
              onClick={() => navigate("/recover-password")}
            >
              Recuperar contraseña
            </strong>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthLogin;