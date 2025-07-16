import React from 'react';
import Navbar from '../components/Navbar';
import TopBar from '../components/TopBar';
import Footer from '../components/Footer';
import ProfileCard from '../components/ProfileCard';
import useUser from '../hooks/useFetchUser';
import '../css/Profile.css'; 

const Profile = () => {
  const userId = localStorage.getItem("userId"); // Obtener ID dinámicamente

  const { user, setUser, updateUser, deleteUser } = useUser(userId);

  if (!user) return <p className="loading-text">Cargando...</p>;

  return (
    <>
      <TopBar />
      <Navbar />
      <div className="profile-page">
        <div className="profile-container">
          <h2 className="profile-title">Mi Perfil</h2>
          <ProfileCard user={user} setUser={setUser} updateUser={updateUser} />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
