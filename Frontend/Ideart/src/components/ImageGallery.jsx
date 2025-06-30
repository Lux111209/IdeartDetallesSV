import React from "react";

const ImageGallery = () => {
  return (
    <div className="image-gallery">
      <img src="/camisa1.png" alt="Camisa 1" />
      <img src="/camisa2.png" alt="Camisa 2" />
      <img src="/camisa3.png" alt="Camisa 3" />
      <div className="extra-images">+3</div>
    </div>
  );
};

export default ImageGallery;
