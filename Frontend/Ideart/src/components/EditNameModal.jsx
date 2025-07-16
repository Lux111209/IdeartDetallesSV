// src/components/EditNameModal.jsx
import React, { useState } from 'react';
import '../css/Profile.css';

const EditNameModal = ({ user, setUser, onClose }) => {
  const [newName, setNewName] = useState(user.name);

  const handleSave = () => {
    setUser({ ...user, name: newName });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Editar Nombre</h3>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <div className="modal-actions">
          <button onClick={handleSave}>Guardar</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default EditNameModal;
