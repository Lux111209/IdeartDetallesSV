import React, { useEffect } from "react";
import useAuth from "../hooks/useFetchRegister.jsx";
import { Calendar } from "lucide-react";
import "../css/Register.css";
import fondo from "../assets/Register.png";
import LogoIdeart from "../assets/Logo Ideart Detalles Nuevo 1.png";
import imgRelleno from "../assets/image (2) 1.png";
import { useNavigate } from "react-router-dom";

export default function RegistroForm() {
  const {
    formData,
    handleInputChange,
    verificationCode,
    setVerificationCode,
    registerUser,
    registerLoading,
    registerError,
    registerSuccess,
    verifyCode,
    verifyLoading,
    verifyError,
    verifySuccess,
  } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (verifySuccess) {
      // Espera 1.5 segundos para mostrar el mensaje antes de redirigir
      const timer = setTimeout(() => {
        navigate("/login");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [verifySuccess, navigate]);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser();
    } catch (error) {
      console.error("Error en el registro:", error.message);
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    try {
      await verifyCode();
    } catch (error) {
      console.error("Error en la verificación:", error.message);
    }
  };

  return (
    <div className="registro-container" style={{ backgroundImage: `url(${fondo})` }}>
      <div className="form-wrapper">
        <div className="left-section">
          <img src={LogoIdeart} alt="Logo Ideart" className="logo-img" />
          <img src={imgRelleno} alt="Imagen decorativa" className="relleno-img" />
        </div>

        <div className="right-section">
          {registerSuccess ? (
            <>
              <h2 className="form-title">Verificar Correo</h2>
              <p className="form-subtitle">
                Hemos enviado un código de verificación a tu correo electrónico. Ingrésalo aquí:
              </p>
              <form className="form-fields" onSubmit={handleVerifySubmit}>
                <input
                  type="text"
                  name="verificationCode"
                  placeholder="Código de Verificación"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                  className="verification-code-input"
                />
                <button type="submit" disabled={verifyLoading}>
                  {verifyLoading ? "Verificando..." : "Verificar Cuenta"}
                </button>
                {verifyError && <p className="error-message">{verifyError}</p>}
                {verifySuccess && <p className="success-message">¡Cuenta verificada con éxito!</p>}
              </form>
            </>
          ) : (
            <>
              <h2 className="form-title">Registrarse</h2>
              <form className="form-fields" onSubmit={handleRegisterSubmit}>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="email"
                  name="correo"
                  placeholder="Correo electrónico"
                  value={formData.correo}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <div className="date-input-wrapper">
                  <input
                    name="fechaNacimiento"
                    type="text"
                    placeholder="Fecha de Nacimiento"
                    value={formData.fechaNacimiento}
                    onChange={handleInputChange}
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) => {
                      if (!e.target.value) e.target.type = "text";
                    }}
                    required
                  />
                  <Calendar className="calendar-icon" />
                </div>
                <button type="submit" disabled={registerLoading}>
                  {registerLoading ? "Registrando..." : "Iniciar"}
                </button>
                {registerError && <p className="error-message">{registerError}</p>}
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
