import React, { useState } from 'react';
import axios from 'axios';
import StarRating from './StarRating';
import Toast from './Toast';  // Importa tu componente Toast
import '../css/Reviews.css';

const ReviewForm = ({ onCancel, id_user, id_producto, onSuccess }) => {
  const [titulo, setTitulo] = useState('');
  const [detalle, setDetalle] = useState('');
  const [rating, setRating] = useState(0);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null); // { type: 'error'|'success', message: '' }

  const validate = () => {
    const newErrors = {};
    if (!titulo.trim()) newErrors.titulo = 'El título es obligatorio';
    if (!detalle.trim()) newErrors.detalle = 'El detalle es obligatorio';
    if (rating <= 0) newErrors.rating = 'Selecciona una calificación';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setToast({ type: 'error', message: 'Por favor corrige los errores en el formulario.' });
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/resenasgeneral', {
        titulo,
        detalle,
        ranking: rating,
        tiposExperiencia: ['recomendado'],
        id_user,
        id_producto,
      });
      setToast({ type: 'success', message: 'Reseña enviada correctamente!' });
      onSuccess();
      onCancel();
    } catch (err) {
      console.error('Error al enviar reseña:', err);
      setToast({ type: 'error', message: 'Error al enviar la reseña. Intenta de nuevo.' });
    }
  };

  return (
    <div className="review-modal" onClick={e => e.target.className === 'review-modal' && onCancel()}>
      <form className="review-form" onSubmit={handleSubmit} noValidate>
        <h3>Agregar Reseña</h3>

        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
        />
        {errors.titulo && <Toast type="warning" message={errors.titulo} />}

        <textarea
          placeholder="Escribe tu reseña"
          value={detalle}
          onChange={e => setDetalle(e.target.value)}
        />
        {errors.detalle && <Toast type="warning" message={errors.detalle} />}

        <div>
          <StarRating rating={rating} onChange={setRating} />
          {errors.rating && <Toast type="warning" message={errors.rating} />}
        </div>

        <div className="form-buttons">
          <button type="submit">Enviar</button>
          <button type="button" onClick={onCancel}>Cancelar</button>
        </div>

        {toast && (
          <div className="toast-wrapper" style={{ marginTop: '1rem' }}>
            <Toast type={toast.type} message={toast.message} />
          </div>
        )}
      </form>
    </div>
  );
};

export default ReviewForm;
