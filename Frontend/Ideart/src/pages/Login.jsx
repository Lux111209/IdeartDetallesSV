import React from "react";
import AuthLogin from "../components/AuthLogin";
import '../css/Login.css';

// Componente de la página de inicio de sesión
const Login = () => {
  return (
    <>
      <main style={{ minHeight: "80vh" }}>
        <AuthLogin />
      </main>
    </>
  );
};

export default Login;
