import React from "react";

const BotonRecu = ({ children, onClick, className = "", disabled }) => {
  const baseStyle = {
    padding: "0.75rem 1rem",
    fontSize: "0.875rem",
    borderRadius: "0.5rem",
    fontWeight: "500",
    backgroundColor: "#A93A60",
    color: "#ffffff",
    transition: "background-color 0.3s",
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
  };

  const hoverStyle = {
    backgroundColor: "#922E53",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={baseStyle}
      onMouseOver={(e) => {
        if (!disabled) e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor;
      }}
      onMouseOut={(e) => {
        if (!disabled) e.currentTarget.style.backgroundColor = baseStyle.backgroundColor;
      }}
    >
      {children}
    </button>
  );
};

export default BotonRecu;
