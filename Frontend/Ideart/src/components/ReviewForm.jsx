import React, { useState } from 'react';
import axios from 'axios';
import StarRating from './StarRating';
import Toast from './Toast';
import '../css/Reviews.css';

// Componente para el formulario de reseñas
const ReviewForm = ({ onCancel, id_user, id_producto, onSuccess }) => {
  const [titulo, setTitulo] = useState('');
  const [detalle, setDetalle] = useState('');
  const [rating, setRating] = useState(0);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  // Maneja los cambios en el título
  const validate = () => {
    const newErrors = {};
    if (!titulo.trim()) newErrors.titulo = 'El título es obligatorio';
    else if (titulo.trim().length < 5) newErrors.titulo = 'El título debe tener al menos 5 caracteres';
    if (!detalle.trim()) newErrors.detalle = 'El detalle es obligatorio';
    else if (detalle.trim().length < 10) newErrors.detalle = 'El detalle debe tener al menos 10 caracteres';
    if (rating <= 0) newErrors.rating = 'Selecciona una calificación';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Verifica si el ID es un ObjectId válido
  const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setToast({ type: 'error', message: 'Corrige los errores del formulario.' });
      return;
    }
    // Verifica que los IDs sean válidos
    if (!isValidObjectId(id_user) || !isValidObjectId(id_producto)) {
      setToast({ type: 'error', message: 'ID de usuario o producto no válido.' });
      return;
    }

    // Crea el payload para la API
    const payload = {
      titulo,
      detalle,
      ranking: Number(rating),
      tiposExperiencia: ['recomendado'],
      id_user,
      id_producto,
    };

    // Envía la reseña a la API
    try {
      const res = await axios.post('https://ideartdetallessv-1.onrender.com/api/resenasgeneral', payload);
      setToast({ type: 'success', message: 'Reseña enviada correctamente!' });
      onSuccess();
      onCancel();
    } catch (err) {
      console.error('Error al enviar reseña:', err);
      if (err.response?.data?.errors) {
        setToast({ type: 'error', message: err.response.data.errors.join(', ') });
      } else {
        setToast({ type: 'error', message: 'Error al enviar la reseña. Intenta de nuevo.' });
      }
    }
  };

  // Renderiza el formulario de reseña
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
          <StarRating rating={rating} onChange={(val) => setRating(Number(val))} />
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
