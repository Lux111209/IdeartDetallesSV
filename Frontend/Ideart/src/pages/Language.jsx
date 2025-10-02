import React, { useState, useEffect } from "react";
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

  // 🔹 Cargar Google Translate script
  useEffect(() => {
    const addScript = document.createElement("script");
    addScript.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.body.appendChild(addScript);

    // Inicializar cuando Google Translate esté listo
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "es", // idioma base
          includedLanguages: "es,en,fr,de",
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };
  }, []);

  // 🔹 Cambiar idioma cuando seleccionas una tarjeta
  const changeLanguage = (lang) => {
    setSelectedLang(lang);

    const interval = setInterval(() => {
      const selectEl = document.querySelector(".goog-te-combo");
      if (selectEl) {
        selectEl.value = lang;
        selectEl.dispatchEvent(new Event("change"));
        clearInterval(interval); // 🔹 Detener cuando ya cambió
      }
    }, 500);
  };

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
                onClick={() => changeLanguage(lang.code)}
              >
                <div className="language-icon">{lang.icon}</div>
                <div className="language-text">{lang.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🔹 Google Translate inserta aquí su widget (lo ocultamos) */}
      <div id="google_translate_element" style={{ display: "none" }}></div>

      <Footer />
    </>
  );
};

export default Language;