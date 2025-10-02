import React, { useEffect } from "react";

const GoogleTranslate = () => {
  useEffect(() => {
    // Agregamos el script de Google Translate
    const addScript = document.createElement("script");
    addScript.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.body.appendChild(addScript);

    // Inicializamos el traductor
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "es", // 👈 idioma base de tu app
          includedLanguages: "es,en,fr,de", // 👈 idiomas permitidos
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element"
      );
    };
  }, []);

  return (
    <div className="my-4">
      <div id="google_translate_element"></div>
    </div>
  );
};

export default GoogleTranslate;
