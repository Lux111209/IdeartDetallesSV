import React, { useState } from 'react';
import { Star } from 'lucide-react';
import '../css/Reviews.css';

const StarRating = ({ rating, onChange }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={28}
          strokeWidth={1.5}
          style={{
            cursor: 'pointer',
            color: star <= (hovered || rating) ? '#FFD700' : '#ccc',
            fill: star <= (hovered || rating) ? '#FFD700' : 'none',
            transition: 'transform 0.2s, color 0.2s',
            transform: star === hovered ? 'scale(1.2)' : 'scale(1)'
          }}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
        />
      ))}
    </div>
  );
};

export default StarRating;
