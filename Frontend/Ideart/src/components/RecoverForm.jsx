import React from "react";
import BotonRecu from "./BotonRecu";
import BotonRecuW from "./BotonRecuW";
import "../css/RecoverForm.css"; 

const RecoverForm = ({
  email,
  setEmail,
  loading,
  error,
  successMessage,
  handleRequestCode,
  handleGoToLogin,
}) => (
  <div className="recover-form">
    <h1 className="title">Ideart</h1>
    <h2 className="subtitle">¿Olvidaste tu contraseña?</h2>
    <p className="instructions">
      Para restablecer su contraseña, ingrese su correo electrónico...
    </p>
    <input
      type="email"
      className="email-input"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      disabled={loading}
    />

    <div className="message">
      {loading && <p className="loading">Enviando...</p>}
      {error && <p className="error">{error}</p>}
      {successMessage && <p className="success">{successMessage}</p>}
    </div>

    <div className="buttons">
      <BotonRecuW onClick={handleGoToLogin} disabled={loading}>
        Volver al inicio de sesión
      </BotonRecuW>
      <BotonRecu onClick={handleRequestCode} disabled={loading}>
        {loading ? "Enviando..." : "Restablecer contraseña"}
      </BotonRecu>
    </div>

    <div className="dots">
      <span className="dot active" />
      <span className="dot" />
      <span className="dot" />
    </div>
  </div>
);

export default RecoverForm;