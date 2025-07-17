import React from "react";
import "../css/RecoverForm.css";

const BotonRecu = ({ children, onClick, disabled }) => {
  return (
    <button onClick={onClick} disabled={disabled} className="boton-recu">
      {children}
    </button>
  );
};

export default BotonRecu;