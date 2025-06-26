import React, { useState } from 'react';
import ReviewCard from './ReviewCard';
import ReviewForm from './ReviewForm';
import '../css/Reviews.css';

const initialReviews = [
  {
    id: 1,
    avatar: '/F1.jpg',
    name: 'Finnick',
    date: 'Hace 2 días',
    rating: 4,
    text: 'Muy buena calidad, es tal cual te lo muestran en sus imágenes, tela muy fresca y el estampado es de muy buena calidad',
    likes: 8,
    dislikes: 2,
  },
  {
    id: 2,
    avatar: '/F2.jpg',
    name: 'César Landaverde',
    date: 'Hace 6 días',
    rating: 5,
    text: 'Muy buena calidad, es tal cual te lo muestran en sus imágenes, tela muy fresca y el estampado es de muy buena calidad',
    likes: 9,
    dislikes: 1,
  },
  {
    id: 3,
    avatar: '/F3.jpg',
    name: 'Luz Gasparío',
    date: 'Hace 6 días',
    rating: 5,
    text: 'Muy buena calidad, es tal cual te lo muestran en sus imágenes, tela muy fresca y el estampado es de muy buena calidad',
    likes: 12,
    dislikes: 3,
  },
  {
    id: 4,
    avatar: '/F4.jpg',
    name: 'Jasooon',
    date: 'Hace 6 días',
    rating: 5,
    text: 'Muy buena calidad, es tal cual te lo muestran en sus imágenes, tela muy fresca y el estampado es de muy buena calidad',
    likes: 28,
    dislikes: 19,
  },
  {
    id: 5,
    avatar: '/F1.jpg',
    name: 'Abi Manzano',
    date: 'Hace 6 días',
    rating: 5,
    text: 'Muy buena calidad, es tal cual te lo muestran en sus imágenes, tela muy fresca y el estampado es de muy buena calidad',
    likes: 30,
    dislikes: 5,
  },
];

const Section = () => {
  const [reviews, setReviews] = useState(initialReviews);
  const [showForm, setShowForm] = useState(false);

  const handleAddReview = (newReview) => {
    setReviews([newReview, ...reviews]);
    setShowForm(false);
  };

  return (
    <div className="review-section">
      <h2>Reseña de Productos</h2>

      <button onClick={() => setShowForm(true)}>Agregar Reseña</button>

      <div className="review-list">
        {reviews.map(review => (
          <ReviewCard key={review.id} {...review} />
        ))}
      </div>

      {showForm && (
        <ReviewForm
          onSubmit={handleAddReview}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default Section;
