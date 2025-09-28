// src/components/ProfileCard.jsx
import React, { useState, useRef } from 'react';
import { Pencil, Lock, Camera, Phone } from 'lucide-react';
import EditNameModal from './EditNameModal';
import ChangePasswordModal from './ChangePasswordModal';
import NumberModal from './NumberModal';
import '../css/Profile.css';

const ProfileCard = ({ user, setUser, updateUser }) => {
  // Estados para mostrar/ocultar modales
  const [showNameModal, setShowNameModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);

  // Referencia para input file oculto que permite cambiar la imagen de perfil
  const fileInputRef = useRef(null);

  // Función que maneja el cambio de imagen seleccionada
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result;
      const updatedUser = { ...user, image: imageUrl };
      setUser(updatedUser); // Actualiza estado local
      if (typeof updateUser === 'function') {
        updateUser(updatedUser); // Actualiza backend
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="profile-card">
      {/* Imagen del usuario */}
      <div className="profile-image-wrapper">
        <img
          src={user.image || '/default-profile.png'}
          alt="Foto de perfil"
          className="profile-img"
        />
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleImageChange}
        />
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
          <button onClick={() => setShowNameModal(true)} aria-label="Editar nombre">
            <Pencil size={16} />
          </button>
        </p>

        <p>
          <span className="label">Email:</span> {user.email}
        </p>

        <p>
          <span className="label">Contraseña:</span> ••••••••
          <button onClick={() => setShowPasswordModal(true)} aria-label="Cambiar contraseña">
            <Lock size={16} />
          </button>
        </p>

        <p>
          <span className="label">Teléfono:</span> {user.phone || ''}
          <button onClick={() => setShowPhoneModal(true)} aria-label="Editar teléfono">
            <Phone size={16} />
          </button>
        </p>
      </div>

      {/* Modales */}
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

      {showPhoneModal && (
        <NumberModal
          user={user}
          setUser={setUser}
          updateUser={updateUser}
          onClose={() => setShowPhoneModal(false)}
        />
      )}
    </div>
  );
};

export default ProfileCard;
