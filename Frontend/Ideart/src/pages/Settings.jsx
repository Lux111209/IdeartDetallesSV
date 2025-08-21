import React, { useState } from "react";
import {
  Bell,
  Globe,
  ShieldCheck,
  Star,
  Tag,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../css/Setting.css";

const Settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const navigate = useNavigate();

  // Activa/desactiva notificaciones y reproduce un beep
  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);

    if (!notificationsEnabled) {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(600, ctx.currentTime); // Frecuencia del beep
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime); // Volumen bajo

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.start();
        oscillator.stop(ctx.currentTime + 0.2); // Duración del beep
      } catch (error) {
        console.error("Error reproduciendo sonido:", error);
      }
    }
  };

  return (
    <>
      <TopBar />
      <Navbar />

      {/* Contenedor principal */}
      <div className="settings-page">
        <div className="settings-box">
          <h2 className="settings-header">Configuración</h2>

          {/* Activar notificaciones */}
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
              <span className="slider"></span>
            </label>
          </div>

          {/* Idioma → Language.jsx */}
          <div
            className="settings-item clickable"
            onClick={() => navigate("/language")}
          >
            <div className="icon-label">
              <Globe size={24} />
              <span>Idioma</span>
            </div>
            <ChevronRight size={20} />
          </div>

          {/* Privacidad y Seguridad */}
          <div
            className="settings-item clickable"
            onClick={() => navigate("/terms-and-conditions")}
          >
            <div className="icon-label">
              <ShieldCheck size={24} />
              <span>Privacidad y Seguridad</span>
            </div>
            <ChevronRight size={20} />
          </div>

          {/* Favoritos */}
          <div
            className="settings-item clickable"
            onClick={() => navigate("/favorites")}
          >
            <div className="icon-label">
              <Star size={24} />
              <span>Favoritos</span>
            </div>
            <ChevronRight size={20} />
          </div>

          {/* Promociones */}
          <div
            className="settings-item clickable"
            onClick={() => navigate("/promotions")}
          >
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
