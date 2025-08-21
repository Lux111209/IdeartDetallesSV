import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation(); // Accedemos a i18n

  // Función para cambiar idioma
  const handleChange = (e) => {
    i18n.changeLanguage(e.target.value); // Cambia el idioma global
  };

  return (
    <select value={i18n.language} onChange={handleChange}>
      <option value="es">Español</option>
      <option value="en">English</option>
      <option value="fr">Français</option>
      <option value="de">Deutsch</option>
      <option value="zh">中文</option>
    </select>
  );
};

export default LanguageSwitcher;
