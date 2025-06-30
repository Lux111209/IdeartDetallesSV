import React, { useState } from 'react';
import StarRating from './StarRating';
import { AlertTriangle } from 'lucide-react';
import '../css/Reviews.css';

const ReviewForm = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(0);

  const [errors, setErrors] = useState({
    name: '',
    text: '',
    rating: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {
      name: name.trim() ? '' : 'El nombre es obligatorio',
      text: text.trim() ? '' : 'La reseña es obligatoria',
      rating: rating > 0 ? '' : 'Selecciona una calificación'
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(error => error !== '');
    if (hasErrors) return;

    onSubmit({
      id: Date.now(),
      avatar: '/F1.jpg',
      name,
      date: 'Hoy',
      rating,
      text,
      likes: 0,
      dislikes: 0,
    });

    setName('');
    setText('');
    setRating(0);
    setErrors({ name: '', text: '', rating: '' });
  };

  const handleBackgroundClick = (e) => {
    if (e.target.className === 'review-modal') {
      onCancel();
    }
  };

  return (
    <div className="review-modal" onClick={handleBackgroundClick}>
      <form className="review-form" onSubmit={handleSubmit}>
        <h3>Agregar reseña</h3>

        <div className="input-group">
          <input
            type="text"
            placeholder="Tu nombre"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          {errors.name && (
            <div className="custom-alert">
              <div className="alert-icon">
                <AlertTriangle size={16} color="white" />
              </div>
              <span>{errors.name}</span>
              <div className="alert-pointer" />
            </div>
          )}
        </div>

        <div className="input-group">
          <textarea
            placeholder="Escribe tu reseña"
            value={text}
            onChange={e => setText(e.target.value)}
          />
          {errors.text && (
            <div className="custom-alert">
              <div className="alert-icon">
                <AlertTriangle size={16} color="white" />
              </div>
              <span>{errors.text}</span>
              <div className="alert-pointer" />
            </div>
          )}
        </div>

        <div className="input-group">
          <StarRating rating={rating} onChange={setRating} />
          {errors.rating && (
            <div className="custom-alert">
              <div className="alert-icon">
                <AlertTriangle size={16} color="white" />
              </div>
              <span>{errors.rating}</span>
              <div className="alert-pointer" />
            </div>
          )}
        </div>

        <div className="form-buttons">
          <button type="submit">Enviar</button>
          <button type="button" onClick={onCancel}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
