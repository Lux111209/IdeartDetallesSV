import React, { useState } from "react";
import {
  Bell,
  Globe,
  ShieldCheck,
  Star,
  Tag,
  ChevronRight,
} from "lucide-react";
import TopBar from "../components/TopBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../css/Setting.css";

const Settings = () => {
  // Estado para controlar si las notificaciones están activadas o no
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Función para activar o desactivar las notificaciones
  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  return (
    <>
      <TopBar />
      <Navbar />

      {/* Contenedor principal de la página de configuración */}
      <div className="settings-page">
        <div className="settings-box">
          <h2 className="settings-header">Configuración</h2>

          {/* Opción para activar/desactivar notificaciones */}
          <div className="settings-item">
            <div className="icon-label">
              <Bell size={24} />
              <span>Activar Notificaciones</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={toggleNotifications}
              />
              <span className="slider"></span> {/* Estilo del switch */}
            </label>
          </div>

          {/* Opciones navegables (solo visuales aquí, sin funcionalidad) */}
          <div className="settings-item clickable">
            <div className="icon-label">
              <Globe size={24} />
              <span>Idioma</span>
            </div>
            <ChevronRight size={20} /> {/* Icono flecha para indicar navegación */}
          </div>

          <div className="settings-item clickable">
            <div className="icon-label">
              <ShieldCheck size={24} />
              <span>Privacidad y Seguridad</span>
            </div>
            <ChevronRight size={20} />
          </div>

          <div className="settings-item clickable">
            <div className="icon-label">
              <Star size={24} />
              <span>Favoritos</span>
            </div>
            <ChevronRight size={20} />
          </div>

          <div className="settings-item clickable">
            <div className="icon-label">
              <Tag size={24} />
              <span>Promociones y Ofertas</span>
            </div>
            <ChevronRight size={20} />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Settings;
