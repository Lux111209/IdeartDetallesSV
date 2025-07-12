import React, { useState } from "react";
import '../css/Review.css';
import Sidebar from "../components/Sidebar"; 

const Review = () => {
  const [productReviews, setProductReviews] = useState([
    {
      id: 1,
      type: 'product',
      icon: '📚',
      title: 'Producto: Libro de Cocina Premium',
      rating: 5,
      content: 'Excelente libro con recetas muy detalladas y fáciles de seguir. Las fotografías son hermosas y la calidad del papel es premium. Definitivamente vale la pena la inversión. Mis habilidades culinarias han mejorado notablemente desde que comencé a usar este libro.',
      author: 'María González',
      date: '2024-07-10'
    },
    {
      id: 2,
      type: 'product',
      icon: '🔧',
      title: 'Producto: Set de Herramientas Profesional',
      rating: 4,
      content: 'Buena calidad de herramientas, resistentes y funcionales. Aunque el precio podría ser más competitivo para el mercado actual. Sin embargo, recomendado para uso profesional debido a su durabilidad y precisión en el trabajo.',
      author: 'Carlos López',
      date: '2024-07-09'
    },
    {
      id: 3,
      type: 'product',
      icon: '🌍',
      title: 'Producto: Mapa Mundial Decorativo',
      rating: 5,
      content: 'Perfecto para decorar la oficina. Excelente calidad de impresión con detalles precisos y colores vibrantes. Llegó muy bien empacado y sin daños. El tamaño es ideal para espacios medianos y grandes.',
      author: 'Ana Martínez',
      date: '2024-07-08'
    },
    {
      id: 7,
      type: 'product',
      icon: '💻',
      title: 'Producto: Laptop Gaming Pro',
      rating: 4,
      content: 'Excelente rendimiento para gaming y trabajo profesional. La pantalla es increíble y el teclado muy cómodo. Única queja es que la batería podría durar más, pero considerando el poder de procesamiento es comprensible.',
      author: 'David Chen',
      date: '2024-07-07'
    },
    {
      id: 8,
      type: 'product',
      icon: '🎧',
      title: 'Producto: Auriculares Bluetooth',
      rating: 3,
      content: 'Sonido decente para el precio, pero la cancelación de ruido no es tan efectiva como esperaba. Cómodos para usar por períodos largos. La batería dura todo el día sin problemas.',
      author: 'Sofia Ruiz',
      date: '2024-07-06'
    }
  ]);

  const [generalReviews, setGeneralReviews] = useState([
    {
      id: 4,
      type: 'general',
      icon: '🧙‍♂️',
      title: 'Reseña General - Atención al Cliente',
      rating: 5,
      content: 'Excelente atención al cliente con respuesta rápida a todas las consultas y resolución efectiva de problemas. El equipo de soporte es muy profesional y siempre dispuesto a ayudar. Muy satisfecho con el nivel de servicio proporcionado.',
      author: 'Pedro Ramírez',
      date: '2024-07-10'
    },
    {
      id: 5,
      type: 'general',
      icon: '🚚',
      title: 'Reseña General - Servicio de Entrega',
      rating: 3,
      content: 'La entrega fue más lenta de lo esperado según los tiempos prometidos inicialmente. Sin embargo, el producto llegó en perfecto estado y bien empacado. Podrían mejorar significativamente los tiempos de envío para competir mejor.',
      author: 'Laura Sánchez',
      date: '2024-07-09'
    },
    {
      id: 6,
      type: 'general',
      icon: '💼',
      title: 'Reseña General - Experiencia de Compra',
      rating: 4,
      content: 'En general una muy buena experiencia de compra online. El sitio web es intuitivo y fácil de navegar, el proceso de pago es seguro y confiable. La única mejora sería tener más opciones de pago disponibles.',
      author: 'Roberto Torres',
      date: '2024-07-08'
    },
    {
      id: 9,
      type: 'general',
      icon: '🏪',
      title: 'Reseña General - Experiencia en Tienda',
      rating: 5,
      content: 'Visité la tienda física y quedé impresionado con la organización y limpieza del lugar. El personal es muy conocedor de los productos y ofrece excelentes recomendaciones. Definitivamente regresaré.',
      author: 'Carmen Vega',
      date: '2024-07-05'
    }
  ]);

  const [selectedReview, setSelectedReview] = useState(null);

  const handleReviewClick = (review) => {
    setSelectedReview(review);
  };

  const handleAcceptReview = () => {
    if (selectedReview) {
      console.log('Reseña aceptada:', selectedReview);
      alert('✅ Reseña aceptada exitosamente');
      setSelectedReview(null);
    }
  };

  const handleRejectReview = () => {
    if (selectedReview) {
      const confirmDelete = window.confirm('¿Estás seguro de que quieres eliminar esta reseña?');
      if (confirmDelete) {
        if (selectedReview.type === 'product') {
          setProductReviews(prev => prev.filter(review => review.id !== selectedReview.id));
        } else {
          setGeneralReviews(prev => prev.filter(review => review.id !== selectedReview.id));
        }
        alert('🗑️ Reseña eliminada');
        setSelectedReview(null);
      }
    }
  };

  const closeModal = () => {
    setSelectedReview(null);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={index < rating ? 'star filled' : 'star'}>
        ⭐
      </span>
    ));
  };

  const ReviewCard = ({ review, onClick }) => (
    <div className="review-card" onClick={() => onClick(review)}>
      <div className="review-icon">{review.icon}</div>
      <div className="review-rating">
        {renderStars(review.rating)}
      </div>
      <div className="review-content">
        <h4>{review.title}</h4>
        <p>{review.content}</p>
        <small>Por: {review.author} • {review.date}</small>
      </div>
    </div>
  );

  return (
    <div className="review-manager">
      <Sidebar />
      
      <div className="main-content">
        <header className="header">
          <h1> Gestor de Reseñas</h1>
        </header>

        <div className="content">
          <h2>Administrar Comentarios y Valoraciones</h2>
          
          {/* Reseñas de Productos */}
          <div className="reviews-section">
            <h3> Reseñas de Productos ({productReviews.length})</h3>
            {productReviews.length > 0 ? (
              <div className="reviews-grid">
                {productReviews.map(review => (
                  <ReviewCard 
                    key={review.id} 
                    review={review} 
                    onClick={handleReviewClick}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-reviews">
                <div className="empty-icon">📦</div>
                <h4>No hay reseñas de productos</h4>
                <p>Las reseñas de productos aparecerán aquí cuando los clientes las envíen.</p>
              </div>
            )}
          </div>

          {/* Reseñas Generales */}
          <div className="reviews-section">
            <h3> Reseñas Generales del Servicio ({generalReviews.length})</h3>
            {generalReviews.length > 0 ? (
              <div className="reviews-grid">
                {generalReviews.map(review => (
                  <ReviewCard 
                    key={review.id} 
                    review={review} 
                    onClick={handleReviewClick}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-reviews">
                <div className="empty-icon">🏢</div>
                <h4>No hay reseñas generales</h4>
                <p>Las reseñas sobre el servicio general aparecerán aquí.</p>
              </div>
            )}
          </div>

          {/* Modal para revisar reseña */}
          {selectedReview && (
            <div className="modal-overlay" onClick={closeModal}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={closeModal}>×</button>
                
                <div className="modal-header">
                  <div className="modal-icon">{selectedReview.icon}</div>
                  <h3>{selectedReview.title}</h3>
                  <div className="modal-rating">
                    {renderStars(selectedReview.rating)}
                  </div>
                </div>
                
                <div className="modal-body">
                  <p>{selectedReview.content}</p>
                  <div className="review-meta">
                    <strong>👤 Autor:</strong> {selectedReview.author}<br/>
                    <strong>📅 Fecha:</strong> {selectedReview.date}<br/>
                    <strong>🏷️ Tipo:</strong> {selectedReview.type === 'product' ? 'Reseña de Producto' : 'Reseña General del Servicio'}<br/>
                    <strong>⭐ Calificación:</strong> {selectedReview.rating}/5 estrellas
                  </div>
                </div>
                
                <div className="modal-actions">
                  <button className="accept-btn" onClick={handleAcceptReview}>
                    ✅ Aceptar
                  </button>
                  <button className="reject-btn" onClick={handleRejectReview}>
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Review;