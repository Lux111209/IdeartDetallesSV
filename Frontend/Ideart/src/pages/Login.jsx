import React from "react";
import AuthLogin from "../components/AuthLogin";
import '../css/Login.css';

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
