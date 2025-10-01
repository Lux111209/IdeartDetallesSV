import React, { useState, useEffect } from "react";
import { useFetchRecoverPassword } from "../hooks/useFetchRecoverPassword";
import CheckNumberForm from "../components/CheckNumberForm";
import { useNavigate } from "react-router-dom";

const CheckNumber = () => {
  const navigate = useNavigate();
  const {
    loading,
    error,
    successMessage,
    handleVerifyCode,
  } = useFetchRecoverPassword();

  const [email, setEmail] = useState("");
  const [codeDigits, setCodeDigits] = useState(["", "", "", "", ""]);

  useEffect(() => {
    const storedEmail = localStorage.getItem('recoveryEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const onVerifyCode = () => {
    const code = codeDigits.join('');
    handleVerifyCode(code);
  };

  return (
    <CheckNumberForm
      email={email}
      codeDigits={codeDigits}
      setCodeDigits={setCodeDigits}
      loading={loading}
      error={error}
      successMessage={successMessage}
      handleVerifyCode={onVerifyCode}
    />
  );
};

export default CheckNumber;