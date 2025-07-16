import React, { useState, useRef } from 'react';
import { Pencil, Lock, Camera } from 'lucide-react';
import EditNameModal from './EditNameModal';
import ChangePasswordModal from './ChangePasswordModal';
import ProfileImageUploader from './ProfileImageUpload';
import '../css/Profile.css';

const ProfileCard = ({ user, setUser, updateUser }) => {
    const [showNameModal, setShowNameModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const imageUrl = reader.result;
            setUser((prev) => ({ ...prev, image: imageUrl }));

            if (typeof updateUser === 'function') {
                updateUser({ ...user, image: imageUrl });
            } else {
                console.warn('updateUser is not a function');
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="profile-card">
            <div className="profile-image-wrapper">
                <div className="profile-image">
                    <img src={user.image || '/default-profile.png'} alt="Foto de perfil" />
                </div>
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
                >
                    <Camera size={18} />
                </div>
            </div>

            <div className="profile-info">
                <p>
                    <span className="label">Nombre:</span> {user.name}
                    <button onClick={() => setShowNameModal(true)}>
                        <Pencil size={16} />
                    </button>
                </p>

                <p>
                    <span className="label">Email:</span> {user.email}
                </p>

                <p>
                    <span className="label">Contraseña:</span> ••••••••
                    <button onClick={() => setShowPasswordModal(true)}>
                        <Lock size={16} />
                    </button>
                </p>


                <p>
                    <span className="label">Teléfono:</span> {user.phone}
                </p>
            </div>

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
