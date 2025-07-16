import React from "react";
import "../css/RecoverForm.css";

const BotonRecuW = ({ children, onClick, disabled }) => {
  return (
    <button onClick={onClick} disabled={disabled} className="boton-recu-w">
      {children}
    </button>
  );
};

export default BotonRecuW;
