import React, { useState } from 'react';
import { Star, ThumbsUp } from 'lucide-react';

const ReviewCard = ({ resena, onUpdate }) => {
  const [util, setUtil] = useState(resena.util || 0);
  const [clicked, setClicked] = useState(false);

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

  return (
    <div className="review-card">
      <div className="review-header">
        <strong>{resena.titulo}</strong>
        <p className="review-date">{new Date(resena.fechaResena).toLocaleDateString()}</p>
      </div>

      <div className="review-rating">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={16} fill={i < resena.ranking ? '#ffc107' : 'none'} color="#ffc107" />
        ))}
      </div>

      <p className="review-text">{resena.detalle}</p>

      <div className="review-footer">
        <span onClick={handleUtil} style={{ cursor: 'pointer' }}>
          <ThumbsUp size={16} fill={clicked ? '#ffd700' : 'none'} color={clicked ? '#ffd700' : 'white'} />
          {util}
        </span>
      </div>
    </div>
  );
};

export default ReviewCard;
