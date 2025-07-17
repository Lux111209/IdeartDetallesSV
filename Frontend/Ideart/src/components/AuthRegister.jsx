// Este componente es para registrar nuevos usuarios

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useRegister from "../hooks/useFetchRegister";
import Toast from "../components/Toast";
import "../css/Login.css";

const AuthRegister = () => {
  const { register, loading } = useRegister(); // Hook para hacer el registro
  const navigate = useNavigate(); // Para redirigir
  const [toast, setToast] = useState(null); // Para mostrar alertas

  // Formulario base
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    password: "",
    fechaNacimiento: "",
    favoritos: [],
  });

  // Cada vez que escriben en un input, actualizamos ese campo
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Cuando se envía el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { nombre, correo, password, fechaNacimiento } = form;

    // Validaciones básicas
    if (!nombre || !correo || !password || !fechaNacimiento) {
      return setToast({ type: "error", message: "Todos los campos son obligatorios." });
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(correo)) {
      return setToast({ type: "error", message: "Correo no válido." });
    }

    if (password.length < 6) {
      return setToast({ type: "error", message: "La contraseña debe tener al menos 6 caracteres." });
    }

    // Registramos al usuario
    const result = await register(form);
    if (result.success) {
      setToast({ type: "success", message: "Registro exitoso. Verifica tu correo." });
      setTimeout(() => navigate("/verificar-email"), 1500); // Redirige a pantalla de verificación
    } else {
      setToast({ type: "error", message: "Error al registrar usuario." });
    }
  };

  return (
    <div className="container">
      <div className="left" />
      <div className="right">
        <h1 className="title">Registrarse</h1>

        <form onSubmit={handleSubmit} className="form">
          <input name="nombre" type="text" placeholder="Nombre" className="input" onChange={handleChange} required />
          <input name="correo" type="email" placeholder="Correo electrónico" className="input" onChange={handleChange} required />
          <input name="password" type="password" placeholder="Contraseña" className="input" onChange={handleChange} required />
          <input name="fechaNacimiento" type="date" className="input" onChange={handleChange} required />

          <button type="submit" className="button" disabled={loading}>
            {loading ? "Registrando..." : "Registrarse"}
          </button>

          {toast && <Toast type={toast.type} message={toast.message} />}

          <div className="link">
            ¿Ya tienes cuenta?{" "}
            <strong onClick={() => navigate("/login")} style={{ cursor: "pointer" }}>
              Iniciar sesión
            </strong>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthRegister;
