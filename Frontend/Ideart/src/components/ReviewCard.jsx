// src/components/ReviewCard.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';

const ReviewCard = ({ avatar, name, date, rating, text, likes, dislikes }) => {
  const [likeCount, setLikeCount] = useState(likes);
  const [dislikeCount, setDislikeCount] = useState(dislikes);
  const [selected, setSelected] = useState(null); // 'like' | 'dislike' | null

  const handleLike = () => {
    if (selected === 'like') return; // ya seleccionado
    if (selected === 'dislike') {
      setDislikeCount(dislikeCount - 1);
    }
    setLikeCount(likeCount + 1);
    setSelected('like');
  };

  const handleDislike = () => {
    if (selected === 'dislike') return;
    if (selected === 'like') {
      setLikeCount(likeCount - 1);
    }
    setDislikeCount(dislikeCount + 1);
    setSelected('dislike');
  };

  return (
    <div className="review-card">
      <div className="review-header">
        <img src={avatar} alt={name} className="avatar" />
        <div>
          <strong>{name}</strong>
          <p className="review-date">{date}</p>
        </div>
      </div>

      <div className="review-rating">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            fill={i < rating ? '#ffc107' : 'none'}
            color="#ffc107"
          />
        ))}
      </div>

      <p className="review-text">{text}</p>

      <div className="review-footer">
        <span onClick={handleLike}>
          <ThumbsUp
            size={16}
            fill={selected === 'like' ? '#ffd700' : 'none'}
            color={selected === 'like' ? '#ffd700' : 'white'}
          />
          {likeCount}
        </span>
        <span onClick={handleDislike}>
          <ThumbsDown
            size={16}
            fill={selected === 'dislike' ? '#ffd700' : 'none'}
            color={selected === 'dislike' ? '#ffd700' : 'white'}
          />
          {dislikeCount}
        </span>
      </div>
    </div>
  );
};

ReviewCard.propTypes = {
  avatar: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  likes: PropTypes.number.isRequired,
  dislikes: PropTypes.number.isRequired,
};

export default ReviewCard;
