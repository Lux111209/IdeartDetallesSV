import React, { useState, useEffect } from "react";
import '../css/Review.css';
import Sidebar from "../components/Sidebar"; 

const Review = () => {
  // Estados para manejar las reseñas y la interfaz
  const [productReviews, setProductReviews] = useState([]);
  const [generalReviews, setGeneralReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [loading, setLoading] = useState(true);

  // URL base de la API
  const API_URL = 'https://ideartdetallessv-1.onrender.com/api';

  // Función para obtener datos del servidor
  const fetchData = async (url) => {
    try {
      console.log('Fetching:', url); // Para debug
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data); 
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Fetch error:', error);
      return [];
    }
  };

  // Función para eliminar una reseña
  const deleteReview = async (url) => {
    try {
      console.log('Deleting:', url); 
      const response = await fetch(url, { 
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      // Verificar si la eliminación fue exitosa
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Delete response:', data); 
      return data.success;
    } catch (error) {
      console.error('Delete error:', error);
      return false;
    }
  };

  // Función para cargar todas las reseñas desde el servidor
  const loadReviews = async () => {
    setLoading(true);
    
    // Obtener reseñas de productos desde la API
    const productos = await fetchData(`${API_URL}/resenasproducto`);
    const productosFormateados = productos.map(review => ({
      id: review._id,
      type: 'product',
      icon: '📦',
      title: `Producto: ${review.id_producto?.name || 'Sin nombre'}`,
      rating: review.ranking,
      content: review.detalle,
      author: review.id_user?.nombre || 'Usuario',
      date: new Date(review.fechaResena).toLocaleDateString()
    }));

    // Obtener reseñas generales desde la API
    const generales = await fetchData(`${API_URL}/resenasgeneral`);
    const generalesFormateados = generales.map(review => ({
      id: review._id,
      type: 'general',
      icon: '🏢',
      title: `General: ${review.titulo}`,
      rating: review.ranking,
      content: review.detalle,
      author: review.id_user?.nombre || 'Usuario',
      date: new Date(review.fechaResena).toLocaleDateString()
    }));

    // Actualizar los estados con las reseñas formateadas
    setProductReviews(productosFormateados);
    setGeneralReviews(generalesFormateados);
    setLoading(false);
  };

  // Cargar reseñas cuando el componente se monta
  useEffect(() => {
    loadReviews();
  }, []);

  // Manejar el clic en una reseña para mostrarla en el modal
  const handleReviewClick = (review) => {
    setSelectedReview(review);
  };

  // Manejar la aceptación de una reseña
  const handleAcceptReview = () => {
    if (selectedReview) {
      alert('Reseña aceptada');
      setSelectedReview(null);
    }
  };

  // Manejar el rechazo/eliminación de una reseña
  const handleRejectReview = async () => {
    if (!selectedReview) return;

    // Confirmar antes de eliminar
    const confirmDelete = window.confirm('¿Eliminar esta reseña?');
    if (!confirmDelete) return;

    // Determinar el endpoint según el tipo de reseña
    const endpoint = selectedReview.type === 'product' 
      ? `${API_URL}/resenasproducto/${selectedReview.id}`
      : `${API_URL}/resenasgeneral/${selectedReview.id}`;

    const success = await deleteReview(endpoint);
    
    if (success) {
      // Remover la reseña de la lista local
      if (selectedReview.type === 'product') {
        setProductReviews(prev => prev.filter(r => r.id !== selectedReview.id));
      } else {
        setGeneralReviews(prev => prev.filter(r => r.id !== selectedReview.id));
      }
      alert('Reseña eliminada');
      setSelectedReview(null);
    } else {
      alert('Error al eliminar');
    }
  };

  // Cerrar el modal
  const closeModal = () => {
    setSelectedReview(null);
  };

  // Función para renderizar las estrellas de calificación
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={index < rating ? 'star filled' : 'star'}>
        ⭐
      </span>
    ));
  };

  // Componente para mostrar cada tarjeta de reseña
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

  // Mostrar pantalla de carga mientras se obtienen los datos
  if (loading) {
    return (
      <div className="review-manager">
        <Sidebar />
        <div className="main-content">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <h2>Cargando reseñas...</h2>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar la interfaz principal
  return (
    <div className="review-manager">
      <Sidebar />
      
      <div className="main-content">
        {/* Encabezado de la página */}
        <header className="header">
          <h1>Gestor de Reseñas</h1>
        </header>

        <div className="content">
          <h2>Administrar Comentarios y Valoraciones</h2>
          
          {/* Sección de reseñas de productos */}
          <div className="reviews-section">
            <h3>Reseñas de Productos ({productReviews.length})</h3>
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
              // Mostrar mensaje cuando no hay reseñas de productos
              <div className="empty-reviews">
                <div className="empty-icon"></div>
                <h4>No hay reseñas de productos</h4>
              </div>
            )}
          </div>

          {/* Sección de reseñas generales */}
          <div className="reviews-section">
            <h3>Reseñas Generales ({generalReviews.length})</h3>
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
              // Mostrar mensaje cuando no hay reseñas generales
              <div className="empty-reviews">
                <div className="empty-icon"></div>
                <h4>No hay reseñas generales</h4>
              </div>
            )}
          </div>

          {/* Modal para mostrar detalles de la reseña seleccionada */}
          {selectedReview && (
            <div className="modal-overlay" onClick={closeModal}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {/* Botón para cerrar el modal */}
                <button className="close-btn" onClick={closeModal}>×</button>
                
                {/* Encabezado del modal */}
                <div className="modal-header">
                  <div className="modal-icon">{selectedReview.icon}</div>
                  <h3>{selectedReview.title}</h3>
                  <div className="modal-rating">
                    {renderStars(selectedReview.rating)}
                  </div>
                </div>
                
                {/* Contenido del modal */}
                <div className="modal-body">
                  <p>{selectedReview.content}</p>
                  <div className="review-meta">
                    <strong>Autor:</strong> {selectedReview.author}<br/>
                    <strong>Fecha:</strong> {selectedReview.date}<br/>
                    <strong>Tipo:</strong> {selectedReview.type === 'product' ? 'Producto' : 'General'}<br/>
                    <strong>⭐ Calificación:</strong> {selectedReview.rating}/5 estrellas
                  </div>
                </div>
                
                {/* Botones de acción del modal */}
                <div className="modal-actions">
                  <button className="accept-btn" onClick={handleAcceptReview}>
                    Aceptar
                  </button>
                  <button className="reject-btn" onClick={handleRejectReview}>
                    Eliminar
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