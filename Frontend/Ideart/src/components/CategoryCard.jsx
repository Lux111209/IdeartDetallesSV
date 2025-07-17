import React from 'react';
import PropTypes from 'prop-types';

// Este componente muestra una categoría con imagen y texto (ej. Arte, Moda, Diseño...)
const CategoryCard = ({ image, title }) => {
  return (
    <div className="category-card">
      {/* Aquí se muestra la imagen de la categoría */}
      <div className="image-wrapper">
        <img src={image} alt={title} />
      </div>

      {/* Aquí se muestra el nombre de la categoría */}
      <p>{title}</p>
    </div>
  );
};

// Validación para asegurarse que reciba los props correctos
CategoryCard.propTypes = {
  image: PropTypes.string.isRequired, // Debe ser una URL de imagen
  title: PropTypes.string.isRequired, // Debe ser un texto
};

export default CategoryCard;
