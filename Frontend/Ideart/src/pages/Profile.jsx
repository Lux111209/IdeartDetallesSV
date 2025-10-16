import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import TopBar from "../components/TopBar";
import Footer from "../components/Footer";
import ProfileCard from "../components/ProfileCard";
import "../css/Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔧 Actualiza usuario en el backend
  const updateUser = async (updatedData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !user?._id) return false;

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${user._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!res.ok) throw new Error("Error al actualizar usuario");

      
      const data = await res.json();


      const newUser = {
        _id: data._id,
        name: data.nombre,
        email: data.correo,
        phone: data.telefono || "No registrado",
        image: data.image || updatedData.image || user.image,
      };

      setUser(newUser);
      return true;
    } catch (error) {
      console.error("Error al actualizar:", error);
      return false;
    }
  };

  // 🔹 Obtiene perfil al montar el componente (solo una vez)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/users/me/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.ok) {
          const data = await res.json();
          setUser({
            _id: data._id,
            name: data.nombre,
            email: data.correo,
            phone: data.telefono || "",
            image: data.image || null,
          });
        }
      } catch (error) {
        console.error("Error al obtener perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []); // 👈 solo al montar

  return (
    <>
      <TopBar />
      <Navbar />

      <main className="profile-container">
        <h2 className="profile-title">Mi Perfil</h2>

        {loading ? (
          <p>Cargando perfil...</p>
        ) : user ? (
          <ProfileCard user={user} setUser={setUser} updateUser={updateUser} />
        ) : (
          <p>No se encontró información del usuario</p>
        )}
      </main>

      <Footer />
    </>
  );
};

export default Profile;