import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useRegister from "../hooks/useFetchRegister";
import "../css/Login.css";

const AuthRegister = () => {
  const { register, loading, error, success } = useRegister();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    password: "",
    fechaNacimiento: "",
    favoritos: [],
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(form);
    if (result.success) {
      alert("Registro exitoso. Revisa tu correo para verificar tu cuenta.");
      navigate("/home"); // Navega a /home después de registrarse
    }
  };

  return (
    <div className="container">
      <div className="left">{/* Puedes agregar un logo o imagen aquí */}</div>
      <div className="right">
        <h1 className="title">Registrarse</h1>
        <form onSubmit={handleSubmit} className="form">
          <input
            name="nombre"
            type="text"
            placeholder="Nombre"
            className="input"
            onChange={handleChange}
            required
          />
          <input
            name="correo"
            type="email"
            placeholder="Correo electrónico"
            className="input"
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            className="input"
            onChange={handleChange}
            required
          />
          <input
            name="fechaNacimiento"
            type="date"
            className="input"
            onChange={handleChange}
            required
          />
          <button type="submit" className="button" disabled={loading}>
            {loading ? "Registrando..." : "Registrarse"}
          </button>
          {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
          {success && <div style={{ color: "green", marginTop: "10px" }}>¡Registro exitoso!</div>}
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
