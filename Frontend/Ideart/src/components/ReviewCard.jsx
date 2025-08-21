import React, { useState } from 'react';
import { Star, ThumbsUp } from 'lucide-react';

// Componente para mostrar una reseña
const ReviewCard = ({ resena, onUpdate }) => {
  const [util, setUtil] = useState(resena.util || 0);
  const [clicked, setClicked] = useState(false);

  // Maneja el clic en el botón "útil"
  const handleUtil = async () => {
    if (clicked) return;
    try {
      await fetch(`http://localhost:5000/api/resenasgeneral/${resena._id}/util`, {
        method: 'PATCH',
      });
      setUtil(prev => prev + 1);
      setClicked(true);
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error('Error marcando útil:', err);
    }
  };

  // Renderiza la tarjeta de reseña
  return (
    <div className="review-card">
      <div className="review-header">
        <strong>{resena.titulo}</strong>
        <p className="review-date">{new Date(resena.fechaResena).toLocaleDateString()}</p>
      </div>

      <div className="review-rating">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={16} fill={i < resena.ranking ? '#ffc400ff' : 'none'} color="#ffc400ff" />
        ))}
      </div>

      <p className="review-text">{resena.detalle}</p>

      <div className="review-footer">
        <span onClick={handleUtil} style={{ cursor: 'pointer' }}>
          <ThumbsUp size={16} fill={clicked ? '#ffc400ff' : 'none'} color={clicked ? '#ffc400ff' : 'black'} />
          {util}
        </span>
      </div>
    </div>
  );
};

export default ReviewCard;
