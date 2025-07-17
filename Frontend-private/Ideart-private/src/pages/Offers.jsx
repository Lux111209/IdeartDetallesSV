import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Tag, Package, Calendar, Percent, X } from 'lucide-react';
import Sidebar from "../components/Sidebar";
import '../css/OfferManager.css'; 

const OfferManager = () => {
  // Estados principales
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para datos
  const [products, setProducts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  
  // Estados para formulario
  const [formData, setFormData] = useState({
    nombreOferta: '',
    DescuentoRealizado: '',
    expirada: '',
    activa: true
  });

  // Configuración de la API
  const API_URL = 'http://localhost:5000/api';

  // Cargar datos al iniciar
  useEffect(() => {
    loadData();
  }, []);

  /**
   * Cargar productos y ofertas del backend
   */
  const loadData = async () => {
    setLoading(true);
    try {
      // Cargar productos
      const productsResponse = await fetch(`${API_URL}/products`);
      const productsData = await productsResponse.json();
      
      if (productsData.success) {
        setProducts(productsData.data);
      } else {
        console.error('Error cargando productos:', productsData.message);
      }

      // Cargar ofertas
      const offersResponse = await fetch(`${API_URL}/ofertas`);
      
      if (!offersResponse.ok) {
        throw new Error(`HTTP error! status: ${offersResponse.status}`);
      }
      
      const offersData = await offersResponse.json();
      console.log('Ofertas recibidas:', offersData); // Para debugging
      
      // Manejar tanto el formato {success: true, data: []} como el array directo
      if (offersData.success && Array.isArray(offersData.data)) {
        setOffers(offersData.data);
      } else if (Array.isArray(offersData)) {
        // Para compatibilidad con el formato anterior (array directo)
        setOffers(offersData);
      } else {
        console.error('Formato de ofertas no reconocido:', offersData);
        setOffers([]);
      }

    } catch (error) {
      console.error('Error cargando datos:', error);
      setError('Error al cargar los datos del servidor');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Crear nueva oferta
   */
  const handleCreateOffer = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.nombreOferta.trim()) {
      alert('Por favor ingresa un nombre para la oferta');
      return;
    }

    if (!formData.DescuentoRealizado || formData.DescuentoRealizado < 1 || formData.DescuentoRealizado > 100) {
      alert('Por favor ingresa un descuento válido (1-100%)');
      return;
    }

    if (selectedProducts.length === 0) {
      alert('Por favor selecciona al menos un producto');
      return;
    }

    if (!formData.expirada) {
      alert('Por favor selecciona una fecha de expiración');
      return;
    }

    try {
      setLoading(true);
      
      const offerData = {
        nombreOferta: formData.nombreOferta.trim(),
        DescuentoRealizado: parseInt(formData.DescuentoRealizado),
        productos: selectedProducts,
        expirada: formData.expirada,
        activa: formData.activa
      };

      const response = await fetch(`${API_URL}/ofertas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(offerData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Respuesta crear oferta:', result); // Para debugging

      // Verificar si la respuesta indica éxito
      const isSuccess = result.success !== false && response.ok;

      if (isSuccess) {
        alert('✅ Oferta creada exitosamente!');
        setShowAddModal(false);
        resetForm();
        loadData(); // Recargar datos
      } else {
        throw new Error(result.message || 'Error desconocido');
      }

    } catch (error) {
      console.error('Error creando oferta:', error);
      alert('Error al crear oferta: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Eliminar oferta
   */
  const deleteOffer = async (id, nombreOferta) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar la oferta "${nombreOferta}"?`)) {
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch(`${API_URL}/ofertas/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Respuesta eliminar oferta:', result); // Para debugging

      // Verificar si la eliminación fue exitosa
      const isSuccess = result.success !== false && response.ok;

      if (isSuccess) {
        alert('✅ Oferta eliminada exitosamente');
        loadData(); // Recargar datos
      } else {
        throw new Error(result.message || 'Error desconocido');
      }

    } catch (error) {
      console.error('Error eliminando oferta:', error);
      alert('Error al eliminar oferta: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Manejar selección de productos
   */
  const toggleProductSelection = (productId) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  /**
   * Seleccionar todos los productos
   */
  const selectAllProducts = () => {
    setSelectedProducts(products.map(p => p._id));
  };

  /**
   * Deseleccionar todos los productos
   */
  const clearSelection = () => {
    setSelectedProducts([]);
  };

  /**
   * Limpiar formulario
   */
  const resetForm = () => {
    setFormData({
      nombreOferta: '',
      DescuentoRealizado: '',
      expirada: '',
      activa: true
    });
    setSelectedProducts([]);
  };

  /**
   * Verificar si una oferta está vigente
   */
  const isOfferActive = (offer) => {
    if (!offer.activa) return false;
    const now = new Date();
    const expDate = new Date(offer.expirada);
    return expDate > now;
  };

  if (loading && offers.length === 0 && products.length === 0) {
    return (
      <div className="app-container">
        <Sidebar />
        <div className="loading-container">
          <div className="loading-content">
            <div className="spinner"></div>
            <p className="loading-text">Cargando datos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="content-wrapper">
        <div className="content-inner">
          
          {/* Header */}
          <div className="header">
            <div className="header-content">
              <h1 className="header-title">Gestor de Ofertas</h1>
            </div>
          </div>

          {/* Botón para agregar nueva oferta */}
          <div className="action-section">
            <button 
              onClick={() => setShowAddModal(true)} 
              className="add-button"
              disabled={loading}
            >
              <Plus className="button-icon" />
              {loading ? 'Cargando...' : 'Agregar Oferta'}
            </button>
          </div>

          {/* Mostrar error si existe */}
          {error && (
            <div style={{ 
              background: '#fee', 
              color: '#c33', 
              padding: '15px', 
              borderRadius: '8px', 
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>{error}</span>
              <button 
                onClick={() => setError(null)}
                style={{ background: 'none', border: 'none', color: '#c33', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
          )}

          {/* Estadísticas */}
          <div style={{ 
            display: "flex", 
            gap: "20px", 
            marginBottom: "30px",
            background: "#f8f9fa",
            padding: "20px",
            borderRadius: "8px"
          }}>
            <div style={{ textAlign: "center" }}>
              <h3 style={{ margin: "0", color: "#6c757d", fontSize: "14px" }}>Total Ofertas</h3>
              <p style={{ margin: "5px 0 0 0", fontSize: "24px", fontWeight: "bold", color: "#007bff" }}>
                {offers.length}
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <h3 style={{ margin: "0", color: "#6c757d", fontSize: "14px" }}>Ofertas Activas</h3>
              <p style={{ margin: "5px 0 0 0", fontSize: "24px", fontWeight: "bold", color: "#28a745" }}>
                {offers.filter(offer => isOfferActive(offer)).length}
              </p>
            </div>
            <div style={{ textAlign: "center" }}>
              <h3 style={{ margin: "0", color: "#6c757d", fontSize: "14px" }}>Total Productos</h3>
              <p style={{ margin: "5px 0 0 0", fontSize: "24px", fontWeight: "bold", color: "#6f42c1" }}>
                {products.length}
              </p>
            </div>
          </div>

          {/* Lista de ofertas */}
          <div className="offers-section">
            <h2 className="offers-title">Ofertas Creadas ({offers.length})</h2>
            
            {offers.length > 0 ? (
              <div className="offers-grid">
                {offers.map((offer) => (
                  <div key={offer._id} className="offer-card">
                    <div className="offer-content">
                      <div className="offer-header">
                        <Tag className="offer-icon" />
                        <span className="offer-name">{offer.nombreOferta}</span>
                        <span 
                          className="offer-type"
                          style={{
                            background: isOfferActive(offer) ? '#dcfce7' : '#fee2e2',
                            color: isOfferActive(offer) ? '#166534' : '#991b1b'
                          }}
                        >
                          {isOfferActive(offer) ? 'Activa' : 'Expirada/Inactiva'}
                        </span>
                      </div>
                      
                      <div className="offer-details">
                        <p className="offer-detail">
                          <strong>Descuento:</strong> {offer.DescuentoRealizado}%
                        </p>
                        <p className="offer-detail">
                          <strong>Productos incluidos:</strong> {offer.productos?.length || 0}
                        </p>
                        <p className="offer-detail">
                          <strong>Válido hasta:</strong> {new Date(offer.expirada).toLocaleDateString()}
                        </p>
                        <p className="offer-detail">
                          <strong>Creado:</strong> {new Date(offer.creada || offer.createdAt).toLocaleDateString()}
                        </p>
                        <p className="offer-detail">
                          <strong>Estado:</strong> 
                          <span style={{
                            color: offer.activa ? '#16a34a' : '#ef4444',
                            fontWeight: 'bold',
                            marginLeft: '5px'
                          }}>
                            {offer.activa ? 'Activa' : 'Inactiva'}
                          </span>
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => deleteOffer(offer._id, offer.nombreOferta)}
                      className="delete-offer"
                      disabled={loading}
                      title="Eliminar oferta"
                    >
                      <Trash2 className="delete-icon" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px',
                background: 'white',
                borderRadius: '8px',
                border: '2px dashed #dee2e6'
              }}>
                <Package style={{ width: '48px', height: '48px', color: '#6c757d', margin: '0 auto 16px' }} />
                <h3>No hay ofertas creadas</h3>
                <p>Comienza creando tu primera oferta para productos</p>
                <button 
                  onClick={() => setShowAddModal(true)}
                  style={{
                    padding: "10px 20px",
                    background: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginTop: "10px"
                  }}
                >
                  + Crear Primera Oferta
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal para crear oferta */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Crear Nueva Oferta</h2>
              <button onClick={() => setShowAddModal(false)} className="modal-close">
                <X className="close-icon" />
              </button>
            </div>

            <form onSubmit={handleCreateOffer} className="modal-body">
              {/* Información de la oferta */}
              <div className="form-group">
                <label className="form-label">
                  <Tag className="label-icon" />
                  Nombre de la Oferta
                </label>
                <input
                  type="text"
                  value={formData.nombreOferta}
                  onChange={(e) => setFormData({...formData, nombreOferta: e.target.value})}
                  className="form-input"
                  placeholder="Ej: Descuento de Temporada"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    <Percent className="label-icon" />
                    Porcentaje de Descuento
                  </label>
                  <input
                    type="number"
                    value={formData.DescuentoRealizado}
                    onChange={(e) => setFormData({...formData, DescuentoRealizado: e.target.value})}
                    className="form-input"
                    placeholder="15"
                    min="1"
                    max="100"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Calendar className="label-icon" />
                    Fecha de Expiración
                  </label>
                  <input
                    type="date"
                    value={formData.expirada}
                    onChange={(e) => setFormData({...formData, expirada: e.target.value})}
                    className="form-input"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              </div>

              {/* Selección de productos */}
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label className="form-label">
                    <Package className="label-icon" />
                    Seleccionar Productos ({selectedProducts.length} seleccionados)
                  </label>
                  <div>
                    <button 
                      type="button" 
                      onClick={selectAllProducts}
                      style={{ 
                        marginRight: '10px', 
                        padding: '5px 10px', 
                        fontSize: '12px',
                        background: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Seleccionar Todos
                    </button>
                    <button 
                      type="button" 
                      onClick={clearSelection}
                      style={{ 
                        padding: '5px 10px', 
                        fontSize: '12px',
                        background: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Limpiar
                    </button>
                  </div>
                </div>
                
                <div className="product-selector" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {products.length > 0 ? (
                    products.map((product) => (
                      <div
                        key={product._id}
                        onClick={() => toggleProductSelection(product._id)}
                        className={`product-option ${selectedProducts.includes(product._id) ? 'selected' : ''}`}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="product-option-content">
                          <img 
                            src={product.images?.[0] || 'https://via.placeholder.com/60x60?text=Sin+Imagen'} 
                            alt={product.name} 
                            className="product-option-image" 
                            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                          />
                          <div className="product-option-info">
                            <p className="product-option-name">{product.name}</p>
                            <p className="product-option-price">${product.price?.toFixed(2) || '0.00'}</p>
                            <p style={{ fontSize: '12px', color: '#6c757d' }}>
                              Stock: {product.stock} | Tipo: {product.productType}
                            </p>
                          </div>
                        </div>
                        {selectedProducts.includes(product._id) && (
                          <div className="selected-indicator" style={{ 
                            width: '20px', 
                            height: '20px', 
                            background: '#28a745', 
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '12px'
                          }}>
                            ✓
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#6c757d' }}>
                      <p>No hay productos disponibles</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Botones de acción */}
              <div className="modal-actions">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)} 
                  className="button secondary"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="button primary"
                  disabled={loading || selectedProducts.length === 0}
                >
                  {loading ? 'Creando...' : 'Crear Oferta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferManager;