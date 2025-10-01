import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useFetchRecoverPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  // ===== VALIDAR EMAIL =====
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // ===== 1. SOLICITAR CÓDIGO =====
  const handleRequestCode = async () => {
    if (!email) {
      setError("Por favor, ingrese su correo electrónico.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Por favor, ingrese un correo electrónico válido.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("http://localhost:5000/api/passwordRecovery/requestCode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "No se pudo enviar el correo de recuperación.");

      setSuccessMessage(data.message || "Correo enviado con éxito.");
      localStorage.setItem("recoveryEmail", email);

      setCurrentStep(2);
      navigate("/CheckNumber");
    } catch (err) {
      setError(err.message);
      console.error("Error en handleRequestCode:", err);
    } finally {
      setLoading(false);
    }
  };

  // ===== 2. VERIFICAR CÓDIGO =====
  const handleVerifyCode = async (inputCode) => {
    const codeToUse = inputCode || code;
    const emailToUse = localStorage.getItem("recoveryEmail");
    if (!emailToUse) {
      setError("No se encontró el email para recuperar la contraseña.");
      return;
    }
    if (!codeToUse) {
      setError("Por favor, ingrese el código de verificación.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/passwordRecovery/verifyCode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailToUse,
          code: codeToUse,
        }),
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Código de verificación inválido.");

      setSuccessMessage(data.message || "Código verificado correctamente.");
      setCurrentStep(3);

      navigate("/NewPassword");
    } catch (err) {
      setError(err.message);
      console.error("Error en handleVerifyCode:", err);
    } finally {
      setLoading(false);
    }
  };

  // ===== 3. NUEVA CONTRASEÑA =====
  const handleNewPassword = async () => {
    const emailToUse = localStorage.getItem("recoveryEmail");
    if (!emailToUse) {
      setError("No se encontró el email para recuperar la contraseña.");
      return;
    }
    if (!newPassword || !confirmPassword) {
      setError("Por favor, complete ambos campos de contraseña.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/passwordRecovery/newPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailToUse,
          newPassword,
        }),
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error al actualizar la contraseña.");

      setSuccessMessage(data.message || "Contraseña actualizada correctamente.");
      localStorage.removeItem("recoveryEmail");

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message);
      console.error("Error en handleNewPassword:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    code,
    setCode,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    error,
    successMessage,
    currentStep,
    setCurrentStep,
    handleRequestCode,
    handleVerifyCode,
    handleNewPassword,
  };
};