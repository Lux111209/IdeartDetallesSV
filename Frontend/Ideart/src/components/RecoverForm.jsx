import React, { useEffect } from "react";
import { useFetchRecoverPassword } from "../hooks/useFetchRecoverPassword";
import BotonRecu from "./BotonRecu";
import BotonRecuW from "./BotonRecuW";
import "../css/RecoverForm.css"; 
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RecoverForm = () => {
  const {
    email,
    setEmail,
    loading,
    error,
    successMessage,
    handleRequestCode,
  } = useFetchRecoverPassword();

  const navigate = useNavigate();
  const [isEmailValid, setIsEmailValid] = React.useState(false);

  // Validar email cuando cambie
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(email));
  }, [email]);

  const handleGoToLogin = () => {
    navigate("/login");
  };

  const handleSubmit = async () => {
    if (!isEmailValid) {
      toast.error("Por favor ingrese un correo electrónico válido", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    try {
      await handleRequestCode();
      toast.success("Código enviado correctamente", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (err) {
      toast.error(err.message || "Error al enviar el código", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="recover-form-container">
      <div className="recover-form">
        <div className="title-container">
          <h1 className="title">Ideart</h1>
        </div>
        <h2 className="subtitle">¿Olvidaste tu contraseña?</h2>
        <p className="instructions">
          Para restablecer su contraseña, ingrese su correo electrónico registrado.
          Le enviaremos un código de verificación.
        </p>
        
        <input
          type="email"
          className="email-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          placeholder="ejemplo@correo.com"
        />

        <div className="message">
          {loading && <p className="loading">Enviando código...</p>}
          {error && <p className="error">{error}</p>}
          {successMessage && <p className="success">{successMessage}</p>}
        </div>

        <div className="buttons">
          <BotonRecuW onClick={handleGoToLogin} disabled={loading}>
            Volver al inicio de sesión
          </BotonRecuW>
          <BotonRecu 
            onClick={handleSubmit} 
            disabled={loading || !isEmailValid}
            className={!isEmailValid ? "disabled-button" : ""}
          >
            {loading ? "Enviando..." : "Enviar código"}
          </BotonRecu>
        </div>

        <div className="dots">
          <span className="dot active" />
          <span className="dot" />
          <span className="dot" />
        </div>
      </div>
    </div>
  );
};

export default RecoverForm;