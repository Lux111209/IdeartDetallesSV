import React from 'react';
import styles from './AuthForm.css';
import loginImg from '../../assets/images/login-illustration.svg';

const Login = () => {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <img src={loginImg} alt="Login Illustration" className={styles.image} />
      </div>
      <div className={styles.right}>
        <h1 className={styles.title}>Iniciar Sesión</h1>
        <form className={styles.form}>
          <input type="email" placeholder="Correo electrónico" className={styles.input} />
          <input type="password" placeholder="Contraseña" className={styles.input} />
          <button type="submit" className={styles.button}>Iniciar</button>
          <div className={styles.link}>
            ¿Olvidaste tu contraseña? <strong>Recupérala</strong>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
