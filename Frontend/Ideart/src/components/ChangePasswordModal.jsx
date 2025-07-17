import React, { useState } from 'react';
import '../css/Profile.css';

// Este componente es un modal (ventana emergente) para cambiar la contraseña
const ChangePasswordModal = ({ user, setUser, onClose }) => {
  const [current, setCurrent] = useState('');  // Contraseña actual que escribe el usuario
  const [newPass, setNewPass] = useState('');  // Nueva contraseña que quiere poner
  const [error, setError] = useState('');      // Mensaje de error si algo sale mal

  // Función que se ejecuta cuando el usuario le da clic a "Actualizar"
  const handleChange = () => {
    if (current !== '12345678') { // Simulamos la contraseña actual (esto luego será dinámico con backend)
      setError('Contraseña actual incorrecta.');
      return;
    }

    // Si todo está bien, actualizamos (por ahora solo ocultamos la contraseña con asteriscos)
    setUser({ ...user, password: '********' });
    onClose(); // Cerramos el modal
  };

  return (
    <div className="modal-overlay"> {/* Fondo semitransparente */}
      <div className="modal-box">   {/* Caja blanca del modal */}
        <h3>Cambiar Contraseña</h3>

        {/* Input para la contraseña actual */}
        <input
          type="password"
          placeholder="Actual"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
        />

        {/* Input para la nueva contraseña */}
        <input
          type="password"
          placeholder="Nueva"
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
        />

        {/* Si hay error, lo mostramos */}
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
