import React, { useState } from "react";
import TopBar from "../components/TopBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../css/Language.css";

const Language = () => {
  const [selectedLang, setSelectedLang] = useState("es");

  const languages = [
    { code: "es", name: "Español", icon: "🇪🇸" },
    { code: "en", name: "English", icon: "🇺🇸" },
    { code: "fr", name: "Français", icon: "🇫🇷" },
    { code: "de", name: "Deutsch", icon: "🇩🇪" },
  ];

  return (
    <>
      <TopBar />
      <Navbar />

      <div className="language-page">
        <div className="language-box">
          <h2 className="language-header">Seleccionar Idioma</h2>

          {/* GRID de idiomas como tarjetas */}
          <div className="language-grid">
            {languages.map((lang) => (
              <div
                key={lang.code}
                className={`language-card ${
                  selectedLang === lang.code ? "selected" : ""
                }`}
                onClick={() => setSelectedLang(lang.code)}
              >
                <div className="language-icon">{lang.icon}</div>
                <div className="language-text">{lang.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Language;
