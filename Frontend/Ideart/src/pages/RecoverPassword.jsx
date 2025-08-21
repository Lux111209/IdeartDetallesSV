import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import olvidasteContra from "../assets/imgPass.png";
import RecoverForm from "../components/RecoverForm";
import "../css/RecoverPassword.css";

const RecoverPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleGoToLogin = () => navigate("/");

  const handleRequestCode = async () => {
    if (!email) {
      setError("Por favor, ingrese su correo electrónico.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("https://ideartdetallessv-1.onrender.com/api/passwordRecovery/requestCode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "No se pudo enviar el correo de recuperación.");
      }

      const data = await response.json();
      setSuccessMessage(data.message || "Correo enviado con éxito. Serás redirigido.");

      localStorage.setItem("recoveryEmail", email);
      setTimeout(() => navigate("/CheckNumber"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recover-page">
      <div className="recover-container">
        <RecoverForm
          email={email}
          setEmail={setEmail}
          loading={loading}
          error={error}
          successMessage={successMessage}
          handleRequestCode={handleRequestCode}
          handleGoToLogin={handleGoToLogin}
        />
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="image-container"
        >
          <img src={olvidasteContra} alt="Grupo de personas hablando" className="image" />
        </motion.div>
      </div>
    </div>
  );
};

export default RecoverPassword;
