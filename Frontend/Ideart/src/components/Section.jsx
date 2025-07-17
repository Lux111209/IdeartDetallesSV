import React, { useState } from 'react';
import ReviewForm from './ReviewForm';
import ReviewCard from './ReviewCard';
import { useFetchGeneralReview } from '../hooks/useFetchGeneralReview';
import '../css/Reviews.css';

const ReviewSection = () => {
  const [showForm, setShowForm] = useState(false);
  const { resenas, fetchAllResenas, loading, error } = useFetchGeneralReview();

  // Estos IDs idealmente vienen de props/contexto, aquí simulados:
  const userId = '665fda4f32b934a68ea2be30';
  const productId = '665fa2b3d82d77e174c60fdc';

  // Refrescar reseñas después de crear una nueva o marcar útil
  const handleRefresh = () => {
    fetchAllResenas();
  };

  return (
    <div className="review-section">
      <h2>Opiniones de Clientes</h2>
      <button onClick={() => setShowForm(true)}>Escribir una reseña</button>

      {showForm && (
        <ReviewForm
          onCancel={() => setShowForm(false)}
          id_user={userId}
          id_producto={productId}
          onSuccess={() => {
            handleRefresh();
            setShowForm(false);
          }}
        />
      )}

      {loading && <p>Cargando reseñas...</p>}

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {!loading && !error && resenas.length === 0 && (
        <p>No hay reseñas aún.</p>
      )}

      <div className="review-list">
        {resenas.map(resena => (
          <ReviewCard key={resena._id} resena={resena} onUpdate={handleRefresh} />
        ))}
      </div>
    </div>
  );
};

export default ReviewSection;
