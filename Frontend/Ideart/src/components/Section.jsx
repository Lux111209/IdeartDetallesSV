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
      {error && <p>Error: {error}</p>}

      <div className="review-list">
        {resenas.length > 0 ? (
          resenas.map(r => (
            <ReviewCard key={r._id} resena={r} onUpdate={handleRefresh} />
          ))
        ) : (
          !loading && <p>No hay reseñas aún.</p>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
