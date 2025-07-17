// src/pages/NewPassword.jsx
import React from "react";
import NewPasswordForm from "../components/NewPasswordForm";
import { useFetchRecoverPassword } from "../hooks/useFetchRecoverPassword";

const NewPassword = () => {
  const {
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    handleNewPassword,
    error
  } = useFetchRecoverPassword();

  const handleSubmit = (e) => {
    e.preventDefault();
    handleNewPassword();
  };

  return (
    <NewPasswordForm
      onSubmit={handleSubmit}
      password={newPassword}
      setPassword={setNewPassword}
      confirmPassword={confirmPassword}
      setConfirmPassword={setConfirmPassword}
      error={error}
    />
  );
};

export default NewPassword;
