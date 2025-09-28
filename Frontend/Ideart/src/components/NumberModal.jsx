// src/components/NumberModal.jsx
import React, { useState } from 'react';
import '../css/Profile.css';

const NumberModal = ({ user, setUser, updateUser, onClose }) => {
  // Inicializa con el número registrado o vacío
  const [newPhone, setNewPhone] = useState(user.phone || '');

  const handleSave = () => {
    const updatedUser = { ...user, phone: newPhone };
    setUser(updatedUser); // Actualiza estado local
    if (typeof updateUser === 'function') {
      updateUser(updatedUser); // Actualiza backend
    }
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Editar Teléfono</h3>
        <input
          type="text"
          value={newPhone}
          onChange={(e) => setNewPhone(e.target.value)}
          placeholder="Ingresa tu número"
        />
        <div className="modal-actions">
          <button onClick={handleSave}>Guardar</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default NumberModal;
