// src/components/ChangePasswordModal.jsx
import React, { useState } from "react";
import "../css/Profile.css"; // Estilos del modal

// Componente modal para cambiar la contraseña
const ChangePasswordModal = ({ user, setUser, updateUser, onClose }) => {
  const [newPassword, setNewPassword] = useState(""); // Estado local para la nueva contraseña

  // Guarda la nueva contraseña y cierra el modal
  const handleSave = () => {
    // Actualiza el estado local sin perder el resto de datos
    setUser((prev) => ({ ...prev, password: newPassword }));

    // Llama al updateUser para actualizar en el backend
    if (typeof updateUser === "function") {
      updateUser({ ...user, password: newPassword });
    }

    onClose(); // Cierra el modal
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Cambiar Contraseña</h3>
        {/* Campo de texto para escribir la nueva contraseña */}
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        {/* Botones para guardar o cancelar */}
        <div className="modal-actions">
          <button onClick={handleSave}>Guardar</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
