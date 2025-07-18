import React, { useState, useRef } from 'react';
import { Pencil, Lock, Camera } from 'lucide-react';
import EditNameModal from './EditNameModal';
import ChangePasswordModal from './ChangePasswordModal';
import '../css/Profile.css';

const ProfileCard = ({ user, setUser, updateUser }) => {
  // Estado para mostrar/ocultar modal de editar nombre
  const [showNameModal, setShowNameModal] = useState(false);
  // Estado para mostrar/ocultar modal de cambiar contraseña
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  // Referencia para input file oculto que permite cambiar la imagen de perfil
  const fileInputRef = useRef(null);

  // Función que maneja el cambio de imagen seleccionada
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return; // Si no se seleccionó archivo, salir

    const reader = new FileReader();
    // Cuando termine de leer el archivo, actualizar la imagen en el estado
    reader.onloadend = () => {
      const imageUrl = reader.result;
      setUser((prev) => ({ ...prev, image: imageUrl })); // Actualiza imagen localmente

      // Si hay función para actualizar usuario externamente, llamarla
      if (typeof updateUser === 'function') {
        updateUser({ ...user, image: imageUrl });
      } else {
        console.warn('updateUser is not a function');
      }
    };
    reader.readAsDataURL(file); // Lee el archivo como URL base64
  };

  return (
    <div className="profile-card">
      {/* Contenedor de la imagen con posición relativa para el icono */}
      <div className="profile-image-wrapper">
        {/* Imagen del perfil o imagen por defecto */}
        <img
          src={user.image || '/default-profile.png'}
          alt="Foto de perfil"
          className="profile-img"
        />
        {/* Input file oculto para seleccionar imagen */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleImageChange}
        />
        {/* Icono de cámara para cambiar foto, clickeable */}
        <div
          className="camera-icon"
          onClick={() => fileInputRef.current?.click()}
          title="Cambiar foto"
          role="button"
          tabIndex={0}
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              fileInputRef.current?.click();
            }
          }}
        >
          <Camera size={18} />
        </div>
      </div>

      {/* Información del usuario */}
      <div className="profile-info">
        <p>
          <span className="label">Nombre:</span> {user.name}
          {/* Botón para abrir modal de editar nombre */}
          <button onClick={() => setShowNameModal(true)} aria-label="Editar nombre">
            <Pencil size={16} />
          </button>
        </p>

        <p>
          <span className="label">Email:</span> {user.email}
        </p>

        <p>
          <span className="label">Contraseña:</span> ••••••••
          {/* Botón para abrir modal de cambiar contraseña */}
          <button onClick={() => setShowPasswordModal(true)} aria-label="Cambiar contraseña">
            <Lock size={16} />
          </button>
        </p>

        <p>
          <span className="label">Teléfono:</span> {user.phone}
        </p>
      </div>

      {/* Modales que se muestran según el estado */}
      {showNameModal && (
        <EditNameModal
          user={user}
          setUser={setUser}
          updateUser={updateUser}
          onClose={() => setShowNameModal(false)}
        />
      )}

      {showPasswordModal && (
        <ChangePasswordModal
          user={user}
          setUser={setUser}
          updateUser={updateUser}
          onClose={() => setShowPasswordModal(false)}
        />
      )}
    </div>
  );
};

export default ProfileCard;
