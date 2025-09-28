// src/components/EditNameModal.jsx
import React, { useState } from "react";
import "../css/Profile.css"; // Estilos del modal

// Componente modal para editar el nombre del usuario
const EditNameModal = ({ user, setUser, updateUser, onClose }) => {
  const [newName, setNewName] = useState(user.name); // Estado local con el nombre actual

  // Guarda el nuevo nombre y cierra el modal
  const handleSave = () => {
    // Actualiza el estado local sin perder el resto de datos
    setUser((prev) => ({ ...prev, name: newName }));

    // Llama al updateUser para actualizar en el backend
    if (typeof updateUser === "function") {
      updateUser({ ...user, name: newName });
    }

    onClose(); // Cierra el modal
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Editar Nombre</h3>
        {/* Campo de texto para editar el nombre */}
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
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

export default EditNameModal;
