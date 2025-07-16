import React from "react";

const BotonRecuW = ({ children, onClick, className = "", disabled }) => {
  const style = {
    padding: "0.75rem 1rem",
    fontSize: "0.875rem",
    borderRadius: "0.5rem",
    fontWeight: "500",
    backgroundColor: "#ffffff",
    border: "1px solid #d1d5db", // gray-400
    color: "#1f2937", // gray-800
    transition: "background-color 0.3s",
    cursor: disabled ? "not-allowed" : "pointer",
  };

  const hoverStyle = {
    backgroundColor: "#f3f4f6", // gray-100
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={style}
      onMouseOver={(e) => {
        if (!disabled) e.currentTarget.style.backgroundColor = hoverStyle.backgroundColor;
      }}
      onMouseOut={(e) => {
        if (!disabled) e.currentTarget.style.backgroundColor = style.backgroundColor;
      }}
    >
      {children}
    </button>
  );
};

export default BotonRecuW;