// src/components/ChangePasswordModal.jsx
import React, { useState } from 'react';
import '../css/Profile.css';

const ChangePasswordModal = ({ user, setUser, onClose }) => {
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [error, setError] = useState('');

  const handleChange = () => {
    if (current !== '12345678') { // simulación
      setError('Contraseña actual incorrecta.');
      return;
    }
    setUser({ ...user, password: '********' });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Cambiar Contraseña</h3>
        <input type="password" placeholder="Actual" value={current} onChange={(e) => setCurrent(e.target.value)} />
        <input type="password" placeholder="Nueva" value={newPass} onChange={(e) => setNewPass(e.target.value)} />
        {error && <p className="error">{error}</p>}
        <div className="modal-actions">
          <button onClick={handleChange}>Actualizar</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
