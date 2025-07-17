import { useState } from "react";

const API_BASE_URL = "http://localhost:5000/api";


const useAuth = () => {
  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    password: "",
    fechaNacimiento: "",
    favoritos: [] // Requerido por el backend
  });

  // Estado de código de verificación
  const [verificationCode, setVerificationCode] = useState("");

  // Estado de carga, error y éxito para registro
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState(null);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // Estado de carga, error y éxito para verificación
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState(null);
  const [verifySuccess, setVerifySuccess] = useState(false);

  // Manejador de inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Función para registrar usuario
  const registerUser = async () => {
  setRegisterLoading(true);
  setRegisterError(null);
  setRegisterSuccess(false);

  try {
    const res = await fetch(`${API_BASE_URL}/registerUser`, { // <-- Corregido aquí
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
      credentials: "include"
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Ocurrió un error al registrar el usuario.");
    }

    setRegisterSuccess(true);
    return data;
  } catch (err) {
    setRegisterError(err.message);
    throw err;
  } finally {
    setRegisterLoading(false);
  }
};

  // Función para verificar el código enviado por correo
  const verifyCode = async () => {
    setVerifyLoading(true);
    setVerifyError(null);
    setVerifySuccess(false);

// Hook para manejar el registro de usuarios
const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState(false);

  // Función para manejar el registro
  const register = useCallback(async (userData) => {
    setLoading(true);
    setError("");
    setSuccess(false);


    // Validación básica del formulario
    try {
      const res = await fetch(`${API_BASE_URL}/registerUser/verifyCodeEmail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verificationCode }),
        credentials: "include"
      });

      // Verifica si la respuesta es exitosa
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al verificar el código.");
      }

      setVerifySuccess(true);
      return data;
    } catch (err) {
      setVerifyError(err.message);
      throw err;
    } finally {
      setVerifyLoading(false);
    }
  };

  return {
    formData,
    handleInputChange,
    verificationCode,
    setVerificationCode,
    registerLoading,
    registerError,
    registerSuccess,
    registerUser,
    verifyLoading,
    verifyError,
    verifySuccess,
    verifyCode,
  };
};

export default useAuth;