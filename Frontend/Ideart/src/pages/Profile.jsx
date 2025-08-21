// pages/Profile.jsx
import React from "react";
import TopBar from "../components/TopBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProfileCard from "../components/ProfileCard";
import useUser from "../hooks/useFetchUser";
import "../css/Profile.css";

// Componente para mostrar el perfil del usuario
const Profile = () => {
  // ✅ Ahora ya no leemos localStorage manualmente
  const { user, setUser, loading, error, updateUser } = useUser();

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!user) return <p>No se encontró usuario</p>;

  return (
    <>
      <TopBar />
      <Navbar />
      <div className="profile-page">
        <div className="profile-container">
          <h2>Mi Perfil</h2>
          <ProfileCard user={user} setUser={setUser} updateUser={updateUser} />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
