// AuthLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useLogin from "../hooks/useFetchLogin";
import '../css/Login.css';

const AuthLogin = () => {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useLogin();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      alert("Login exitoso!");
      navigate("/home");  // Redirigir al /home después del login
    }
  };

  return (
    <div className="container">
      <div className="left"></div>
      <div className="right">
        <h1 className="title">Iniciar Sesión</h1>
        <form className="form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo electrónico"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="button" disabled={loading}>
            {loading ? "Cargando..." : "Iniciar"}
          </button>
          {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
          <div className="link">
            ¿Olvidaste tu contraseña? <strong>Registrarme</strong>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthLogin;
