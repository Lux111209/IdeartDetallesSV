// pages/CheckNumber.jsx
import React, { useState, useEffect } from "react";
import { useFetchRecoverPassword } from "../hooks/useFetchRecoverPassword";
import CheckNumberForm from "../components/CheckNumberForm";
import { useNavigate } from "react-router-dom";

const CheckNumber = () => {
  const navigate = useNavigate();
  
  // Usamos el hook para obtener toda la lógica y el estado
  const {
    loading,
    error,
    successMessage,
    handleVerifyCode,
    setCurrentStep, // Usamos esto para la lógica de redirección
  } = useFetchRecoverPassword();

  // Estado local SOLO para manejar los inputs del código
  const [email, setEmail] = useState("");
  const [codeDigits, setCodeDigits] = useState(["", "", "", "", ""]);
  
  // Recuperar el email del localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem('recoveryEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      // Si no hay email, redirige
      navigate('/');
    }
  }, [navigate]);

  // Función que se pasará al formulario para que el hook haga la verificación
  const onVerifyCode = () => {
    const code = codeDigits.join('');
    // Pasamos el email y el código a la función del hook
    handleVerifyCode({ email, code }); 
  };
  
  // Redirigir si el código es exitoso
  useEffect(() => {
    if (successMessage) {
        setTimeout(() => {
            navigate("/NewPassword");
            // Opcionalmente, puedes usar el `currentStep` del hook para manejar esto
            // setCurrentStep(3); 
        }, 2000);
    }
  }, [successMessage, navigate, setCurrentStep]);

  return (
    <CheckNumberForm
      email={email}
      codeDigits={codeDigits}
      setCodeDigits={setCodeDigits}
      loading={loading}
      error={error}
      successMessage={successMessage}
      handleVerifyCode={onVerifyCode} // Pasamos la función wrapper
    />
  );
};

export default CheckNumber;