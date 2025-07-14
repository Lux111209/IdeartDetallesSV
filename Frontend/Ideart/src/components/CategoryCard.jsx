import React from 'react';
import PropTypes from 'prop-types';

const CategoryCard = ({ image, title }) => {
  return (
    <div className="category-card">
      <div className="image-wrapper">
        <img src={image} alt={title} />
      </div>
      <p>{title}</p>
    </div>
  );
};

CategoryCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default CategoryCard;
