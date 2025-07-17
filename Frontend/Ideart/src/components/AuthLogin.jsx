// Importamos cosas necesarias para que funcione el login
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useLogin from "../hooks/useFetchLogin";
import Toast from "../components/Toast";
import '../css/Login.css';

const AuthLogin = () => {
  // Estados para guardar lo que el usuario escribe
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState(null); // Mensaje de error o éxito

  const { login, loading } = useLogin();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (!email || !password) {
      return setToast({ type: "error", message: "Todos los campos son obligatorios." });
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return setToast({ type: "error", message: "Correo no válido." });
    }

    // Intentamos iniciar sesión
    const success = await login(email, password);
    if (success) {
      setToast({ type: "success", message: "Inicio de sesión exitoso." });
      setTimeout(() => navigate("/home"), 1000);
    } else {
      setToast({ type: "error", message: "Credenciales incorrectas." });
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

          {toast && <Toast type={toast.type} message={toast.message} />}

          <div className="link">
            ¿Olvidaste tu contraseña? <strong>Registrarme</strong>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthLogin;
