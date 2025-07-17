// src/components/ProfileImageUploader.jsx
import React from 'react';
import '../css/Profile.css';

const ProfileImageUploader = ({ user, setUser }) => {
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    setUser({ ...user, image: imageUrl });
  };

  return (
    <div className="profile-img-container">
      <label htmlFor="file-input">
        <img src={user.image} alt="profile" className="profile-img" />
      </label>
      <input
        id="file-input"
        type="file"
        accept="image/*"
        hidden
        onChange={handleImageChange}
      />
    </div>
  );
};

export default ProfileImageUploader;
