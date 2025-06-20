import React from 'react';
import '../css/AuthForm.css';

const Login = () => {
  return (
    <div className="container">
      <div className="left">
      </div>
      <div className="right">
        <h1 className="title">Iniciar Sesión</h1>
        <form className="form">
          <input type="email" placeholder="Correo electrónico" className="input" />
          <input type="password" placeholder="Contraseña" className="input" />
          <button type="submit" className="button">Iniciar</button>
          <div className="link">
            ¿Olvidaste tu contraseña? <strong>Registrarme</strong>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
