import React from 'react';
import '../css/AuthForm.css';
//import registerImg from '../assets/Images/Login.jpg';
 
const Register = () => {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <img src={registerImg} alt="Register Illustration" className={styles.image} />
      </div>
      <div className={styles.right}>
        <h1 className={styles.title}>Registrarse</h1>
        <form className={styles.form}>
          <input type="text" placeholder="Nombre" className={styles.input} />
          <input type="email" placeholder="Correo electrónico" className={styles.input} />
          <input type="password" placeholder="Contraseña" className={styles.input} />
          <input type="date" placeholder="Fecha de nacimiento" className={styles.input} />
          <button type="submit" className={styles.button}>Iniciar</button>
        </form>
      </div>
    </div>
  );
};
 
export default Register;