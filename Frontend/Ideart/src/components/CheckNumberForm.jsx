import React, { useRef } from "react";
import imgPass from "../assets/imgPass.png";
import "../css/CheckNumber.css";

const CheckNumberForm = ({
  email,
  codeDigits,
  setCodeDigits,
  loading,
  error,
  successMessage,
  handleVerifyCode,
}) => {
  const inputRefs = useRef([]);

  const handleCodeChange = (index, value) => {
    // Solo permitir números y un carácter
    if (value.length > 1 || (value && !/^\d$/.test(value))) return;
    const newCodeDigits = [...codeDigits];
    newCodeDigits[index] = value;
    setCodeDigits(newCodeDigits);
    // Auto-focus al siguiente input
    if (value && index < 4) inputRefs.current[index + 1]?.focus();
  };

  // Función para manejar el backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !codeDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Función para pegar código completo
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const digits = pastedText.replace(/\D/g, '').slice(0, 5).split('');
    const newCodeDigits = [...codeDigits];
    digits.forEach((digit, index) => {
      if (index < 5) newCodeDigits[index] = digit;
    });
    setCodeDigits(newCodeDigits);
    // Focus en el siguiente input vacío o el último
    const nextEmptyIndex = newCodeDigits.findIndex(digit => !digit);
    const focusIndex = nextEmptyIndex === -1 ? 4 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div className="check-number-container">
      <div className="check-number-wrapper">
        {/* Contenido principal */}
        <div className="check-number-content">
          <h1 className="check-number-title">IdeartDetalles</h1>
          <h2 className="check-number-subtitle">
            Revisa tu correo
          </h2>
          <p className="check-number-description">
            Enviamos un código de verificación a tu dirección de correo: <strong>{email}</strong>. 
            Escribe los dígitos:
          </p>
          
          <div className="verification-code-container">
            <div className="verification-code-inputs">
              {codeDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  disabled={loading}
                  className={`verification-code-input ${digit ? 'filled' : ''}`}
                />
              ))}
            </div>
          </div>

          {/* Mensajes de estado */}
          <div className="check-number-messages">
            {loading && <p className="check-number-message loading">Verificando código...</p>}
            {error && <p className="check-number-message error">{error}</p>}
            {successMessage && <p className="check-number-message success">{successMessage}</p>}
          </div>

          <button 
            onClick={handleVerifyCode}
            disabled={loading || codeDigits.join('').length !== 5}
            className="check-number-button"
          >
            {loading ? 'Verificando...' : 'Verificar código'}
          </button>
        </div>

        {/* Imagen */}
        <div className="check-number-image-container">
          <div className="check-number-image-wrapper">
            <img
              src={imgPass}
              alt="Verificación de código"
              className="check-number-image"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckNumberForm;