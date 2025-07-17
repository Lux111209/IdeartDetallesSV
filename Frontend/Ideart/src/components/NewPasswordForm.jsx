import React from "react";
import "../css/NewPasswordForm.css";
import imgPass from "../assets/imgPass.png";

const NewPasswordForm = ({ onSubmit, password, setPassword, confirmPassword, setConfirmPassword, error }) => {
  return (
    <div className="password-reset-container">
      <div className="form-section">
        <div className="form-content">
          <h1 className="brand-title">IdeartDetalles</h1>
          <h2 className="form-subtitle">Crear una nueva contraseña</h2>
          <p className="form-description">
            Su anterior contraseña se ha restablecido. Ingrese una nueva contraseña para su cuenta de IdeartDetalles y vuelva a iniciar sesión.
          </p>
          
          <form className="new-password-form" onSubmit={onSubmit}>
            <div className="input-group">
              <input
                type="password"
                placeholder="Contraseña nueva"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder="Confirmar contraseña nueva"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="error">{error}</p>}

            <button type="submit" className="submit-button">
              Actualizar contraseña
            </button>
          </form>
        </div>
      </div>
      
      <div className="image-section">
        <div className="image-container">
          <img 
            src={imgPass}
            alt="Personas trabajando juntas"
            className="hero-image"
          />
        </div>
      </div>
    </div>
  );
};

export default NewPasswordForm;