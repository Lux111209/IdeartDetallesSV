import { useState } from "react";

// Hook para manejar la carga de imágenes
export const useImageUpload = () => {
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(URL.createObjectURL(file));
    }
  };

  return { uploadedImage, handleImageUpload };
};
