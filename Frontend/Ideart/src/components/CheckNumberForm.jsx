import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import imgPass from "../assets/imgPass.png";
import "../css/CheckNumber.css";

const CheckNumberForm = () => {
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  // Estados para el email (recuperado) y el código (como array de dígitos)
  const [email, setEmail] = useState("");
  const [codeDigits, setCodeDigits] = useState(["", "", "", "", ""]);
  
  // Estados de la petición
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // useEffect para recuperar el email de localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem('recoveryEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      setError("No se pudo encontrar un correo. Por favor, vuelva a empezar.");
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  }, [navigate]);

  // Función para manejar el cambio en los inputs de código
  const handleCodeChange = (index, value) => {
    // Solo permitir números y un carácter
    if (value.length > 1 || (value && !/^\d$/.test(value))) {
      return;
    }

    const newCodeDigits = [...codeDigits];
    newCodeDigits[index] = value;
    setCodeDigits(newCodeDigits);

    // Auto-focus al siguiente input
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
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
      if (index < 5) {
        newCodeDigits[index] = digit;
      }
    });
    
    setCodeDigits(newCodeDigits);
    
    // Focus en el siguiente input vacío o el último
    const nextEmptyIndex = newCodeDigits.findIndex(digit => !digit);
    const focusIndex = nextEmptyIndex === -1 ? 4 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleGoBack = () => {
    navigate("/recupassword");
  };

  // Función para verificar el código
  const handleVerifyCode = async () => {
    const code = codeDigits.join('');
    
    if (code.length !== 5) {
      setError("Por favor, ingrese el código de verificación completo.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const url = 'https://ideartdetallessv-1.onrender.com/api/passwordRecovery/verifyCode';

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'El código de verificación es incorrecto o ha expirado.');
      }

      const data = await response.json();
      setSuccessMessage(data.message || 'Código verificado correctamente. Redirigiendo...');

      setTimeout(() => {
        navigate("/NewPassword");
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Auto-submit cuando se complete el código
  useEffect(() => {
    const code = codeDigits.join('');
    if (code.length === 5 && !loading) {
      handleVerifyCode();
    }
  }, [codeDigits, loading]);

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

          <button 
            onClick={handleGoBack}
            disabled={loading}
            className="check-number-button secondary"
          >
            Volver
          </button>
          
          {/* Indicadores de progreso */}
          <div className="check-number-progress">
            <span className="check-number-progress-bar inactive"></span>
            <span className="check-number-progress-bar active"></span>
            <span className="check-number-progress-bar inactive"></span>
          </div>
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