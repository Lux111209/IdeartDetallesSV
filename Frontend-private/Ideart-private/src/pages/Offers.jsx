import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search, Filter, X, Plus, Edit, Trash2, Tag, Package, Calendar, Percent, ShoppingCart, Eye, Star } from 'lucide-react';
import Sidebar from "../components/Sidebar";
import '../css/OfferManager.css'; 

const OfferManager = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [discountFrom, setDiscountFrom] = useState('');
  const [discountTo, setDiscountTo] = useState('');
  const [offerType, setOfferType] = useState('category');
  const [offerName, setOfferName] = useState('');
  const [validFrom, setValidFrom] = useState('');
  const [validTo, setValidTo] = useState('');
  const [actionType, setActionType] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState({});
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [offers, setOffers] = useState([]);

  // Estado para paginación de productos en grupos de 3
  const [productPage, setProductPage] = useState(0);

  // Calcula el número total de páginas (3 productos por página)
  const productsPerPage = 3;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Obtiene los productos para la página actual
  const paginatedProducts = filteredProducts.slice(
    productPage * productsPerPage,
    productPage * productsPerPage + productsPerPage
  );

  // Navegación de páginas
  const handlePrevPage = () => {
    setProductPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const handleNextPage = () => {
    setProductPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  // Productos de ejemplo
  const mockProducts = [
    {
      id: 1,
      name: 'Taza de Nubes Premium',
      description: 'Taza de cerámica con diseño de nubes, perfecta para café matutino',
      price: 25.99,
      originalPrice: 29.99,
      category: 'tazas',
      stock: 12,
      orders: 22,
      published: '2024-11-24',
      image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=300&h=300&fit=crop',
      rating: 4.5,
      reviews: 18,
      discount: 15,
      featured: true,
      tags: ['premium', 'cerámica', 'diseño']
    },
    {
      id: 2,
      name: 'Camisa Casual Moderna',
      description: 'Camisa de algodón con diseño contemporáneo, ideal para uso diario',
      price: 35.00,
      originalPrice: 42.00,
      category: 'camisas',
      stock: 8,
      orders: 15,
      published: '2024-11-20',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
      rating: 4.2,
      reviews: 12,
      discount: 17,
      featured: false,
      tags: ['algodón', 'casual', 'moderna']
    },
    {
      id: 3,
      name: 'Mousepad Gaming Pro',
      description: 'Mousepad de alta precisión para gaming profesional',
      price: 20.00,
      originalPrice: 20.00,
      category: 'accesorios',
      stock: 25,
      orders: 18,
      published: '2024-11-22',
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=300&fit=crop',
      rating: 4.8,
      reviews: 32,
      discount: 0,
      featured: true,
      tags: ['gaming', 'precisión', 'profesional']
    },
    {
      id: 4,
      name: 'Juego de Mesa Estratégico',
      description: 'Juego de mesa para 2-4 jugadores con mecánicas innovadoras',
      price: 45.00,
      originalPrice: 50.00,
      category: 'juegos',
      stock: 5,
      orders: 8,
      published: '2024-11-18',
      image: 'https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=300&h=300&fit=crop',
      rating: 4.3,
      reviews: 7,
      discount: 10,
      featured: false,
      tags: ['estrategia', 'familia', 'innovador']
    },
    {
      id: 5,
      name: 'Auriculares Bluetooth',
      description: 'Auriculares inalámbricos con cancelación de ruido',
      price: 89.99,
      originalPrice: 120.00,
      category: 'accesorios',
      stock: 15,
      orders: 28,
      published: '2024-11-25',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
      rating: 4.6,
      reviews: 45,
      discount: 25,
      featured: true,
      tags: ['bluetooth', 'inalámbrico', 'audio']
    },
    {
      id: 6,
      name: 'Chaqueta Deportiva',
      description: 'Chaqueta ligera ideal para actividades deportivas',
      price: 65.00,
      originalPrice: 75.00,
      category: 'camisas',
      stock: 10,
      orders: 11,
      published: '2024-11-23',
      image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=300&fit=crop',
      rating: 4.4,
      reviews: 23,
      discount: 13,
      featured: false,
      tags: ['deportiva', 'ligera', 'actividad']
    },
    {
      id: 7,
      name: 'Reloj Inteligente',
      description: 'Smartwatch con funciones de salud y fitness',
      price: 159.99,
      originalPrice: 199.99,
      category: 'accesorios',
      stock: 18,
      orders: 35,
      published: '2024-11-26',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
      rating: 4.7,
      reviews: 28,
      discount: 20,
      featured: true,
      tags: ['smartwatch', 'fitness', 'tecnología']
    },
    {
      id: 8,
      name: 'Mochila Urbana',
      description: 'Mochila resistente para uso diario y viajes',
      price: 49.99,
      originalPrice: 59.99,
      category: 'accesorios',
      stock: 12,
      orders: 19,
      published: '2024-11-27',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop',
      rating: 4.3,
      reviews: 15,
      discount: 17,
      featured: false,
      tags: ['mochila', 'viaje', 'urbana']
    },
    {
      id: 9,
      name: 'Lámpara LED Moderna',
      description: 'Lámpara de escritorio con control táctil y regulador',
      price: 75.00,
      originalPrice: 85.00,
      category: 'accesorios',
      stock: 8,
      orders: 12,
      published: '2024-11-28',
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&h=300&fit=crop',
      rating: 4.5,
      reviews: 22,
      discount: 12,
      featured: true,
      tags: ['lámpara', 'LED', 'moderna']
    }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setLoading(false);
    };

    fetchProducts();
  }, []);

  // Filtrar productos cuando cambia la categoría seleccionada
  useEffect(() => {
    if (selectedCategoryFilter === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.category === selectedCategoryFilter));
    }
    setProductPage(0); // Reset a la primera página cuando cambia el filtro
  }, [selectedCategoryFilter, products]);

  const categories = [
    { id: 'accesorios', name: 'Accesorios', icon: '🎧' },
    { id: 'juegos', name: 'Juegos', icon: '🎮' },
    { id: 'tazas', name: 'Tazas', icon: '☕' },
    { id: 'camisas', name: 'Camisas', icon: '👕' }
  ];

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategoryFilter(categoryId);
  };

  const handleCategoryDiscount = (categoryId) => {
    setSelectedCategory(categoryId);
    setOfferType('category');
    setOfferName(`Descuento ${categories.find(c => c.id === categoryId)?.name}`);
    setShowAddModal(true);
  };

  const handleProductAction = (product, action) => {
    setSelectedProduct(product);
    setActionType(action);
    
    if (action === 'edit') {
      setEditingProduct({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock
      });
    } else if (action === 'discount') {
      setDiscountFrom(product.discount?.toString() || '');
      setDiscountTo((product.discount + 10)?.toString() || '10');
    }
    
    setShowProductModal(true);
  };

  const handleProductUpdate = async () => {
    if (actionType === 'edit') {
      const updatedProducts = products.map(p => 
        p.id === selectedProduct.id 
          ? { ...p, ...editingProduct }
          : p
      );
      setProducts(updatedProducts);
      alert('Producto actualizado exitosamente');
    } else if (actionType === 'discount') {
      const discount = parseInt(discountFrom);
      const updatedProducts = products.map(p => 
        p.id === selectedProduct.id 
          ? { 
              ...p, 
              discount: discount,
              price: p.originalPrice * (1 - discount / 100)
            }
          : p
      );
      setProducts(updatedProducts);
      alert('Descuento aplicado exitosamente');
    }
    
    setShowProductModal(false);
    resetForm();
  };

  const handleProductDelete = async (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      const updatedProducts = products.filter(p => p.id !== productId);
      setProducts(updatedProducts);
      alert('Producto eliminado exitosamente');
    }
  };

  const resetForm = () => {
    setOfferName('');
    setSelectedCategory('');
    setSelectedProduct(null);
    setDiscountFrom('');
    setDiscountTo('');
    setValidFrom('');
    setValidTo('');
    setOfferType('category');
    setActionType('');
    setEditingProduct({});
  };

  const handleCreateOffer = () => {
    if (offerType === 'category' && !selectedCategory) {
      alert('Por favor selecciona una categoría');
      return;
    }
    if (!discountFrom || !discountTo) {
      alert('Por favor ingresa el rango de descuento');
      return;
    }

    const newOffer = {
      id: Date.now(),
      name: offerName,
      type: offerType,
      target: offerType === 'category' ? selectedCategory : selectedProduct?.id,
      targetName: offerType === 'category' ? categories.find(c => c.id === selectedCategory)?.name : selectedProduct?.name,
      discountFrom: parseInt(discountFrom),
      discountTo: parseInt(discountTo),
      validFrom,
      validTo,
      active: true,
      createdAt: new Date().toLocaleDateString()
    };

    setOffers([...offers, newOffer]);
    setShowAddModal(false);
    resetForm();
  };

  const deleteOffer = (id) => {
    setOffers(offers.filter(offer => offer.id !== id));
  };

  if (loading) {
    return (
      <div className="app-container">
        <Sidebar />
        <div className="loading-container">
          <div className="loading-content">
            <div className="spinner"></div>
            <p className="loading-text">Cargando productos...</p>
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
                <div className="notification-icon">🔔</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-section">
              <button onClick={() => setShowAddModal(true)} className="add-button">
                <Plus className="button-icon" />
                Agregar
              </button>
            </div>

            {/* Categories */}
            <div className="categories-section">
              <div className="categories-header">
                <h2 className="section-title">Categorías</h2>
                <button
                  onClick={() => handleCategoryFilter('all')}
                  className={`filter-button ${selectedCategoryFilter === 'all' ? 'active' : ''}`}
                >
                  Todas las categorías
                </button>
              </div>
              
              <div className="categories-grid">
                {categories.map((category) => (
                  <div key={category.id} className="category-item">
                    <div 
                      onClick={() => handleCategoryFilter(category.id)}
                      className={`category-icon ${selectedCategoryFilter === category.id ? 'active' : ''}`}
                    >
                      <span className="category-emoji">{category.icon}</span>
                    </div>
                    <p className={`category-name ${selectedCategoryFilter === category.id ? 'active' : ''}`}>
                      {category.name}
                    </p>
                    <div className="category-actions">
                      <button
                        onClick={() => handleCategoryDiscount(category.id)}
                        className="category-button secondary"
                      >
                        Aplicar descuento
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {selectedCategoryFilter !== 'all' && (
                <div className="filter-status">
                  <div className="filter-info">
                    <span className="filter-text">
                      Mostrando productos de: {categories.find(c => c.id === selectedCategoryFilter)?.name}
                      {filteredProducts.length > 0 && ` (${filteredProducts.length} productos)`}
                    </span>
                    <button
                      onClick={() => handleCategoryFilter('all')}
                      className="clear-filter"
                    >
                      Limpiar filtro
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Products Section */}
            <div className="products-section">
              <div className="products-header">
                <div className="products-title-wrapper">
                  <h2 className="products-title">Productos</h2>
                  {selectedCategoryFilter !== 'all' && (
                    <span className="filter-badge">
                      {categories.find(c => c.id === selectedCategoryFilter)?.name}
                    </span>
                  )}
                </div>
                <div className="products-count">
                  <span>
                    {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="carousel-container">
                  {totalPages > 1 && (
                    <button
                      className="carousel-arrow carousel-arrow-left"
                      onClick={handlePrevPage}
                      aria-label="Anterior"
                    >
                      <ChevronLeft className="arrow-icon" />
                    </button>
                  )}
                  
                  <div className="carousel-track-container">
                    <div className="carousel-track">
                      {paginatedProducts.map((product) => (
                        <div key={product.id} className="carousel-slide">
                          <div className="product-card">
                            <div className="product-image-container">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="product-image"
                              />
                              {product.featured && (
                                <div className="featured-badge">
                                  <Star className="star-icon" />
                                  Destacado
                                </div>
                              )}
                              {product.discount > 0 && (
                                <div className="discount-badge">
                                  -{product.discount}%
                                </div>
                              )}
                            </div>

                            <div className="product-info">
                              <h3 className="product-title">{product.name}</h3>
                              <p className="product-description">{product.description}</p>
                              
                              {/* Price Section */}
                              <div className="price-section">
                                <div className="price-wrapper">
                                  <span className="current-price">${product.price.toFixed(2)}</span>
                                  {product.discount > 0 && (
                                    <span className="original-price">${product.originalPrice.toFixed(2)}</span>
                                  )}
                                </div>
                                <div className="rating-wrapper">
                                  <Star className="rating-star" />
                                  <span className="rating-text">{product.rating} ({product.reviews})</span>
                                </div>
                              </div>

                              {/* Stats */}
                              <div className="product-stats">
                                <div className="stat">
                                  <p className="stat-value">{product.stock}</p>
                                  <p className="stat-label">Stock</p>
                                </div>
                                <div className="stat">
                                  <p className="stat-value">{product.orders}</p>
                                  <p className="stat-label">Órdenes</p>
                                </div>
                                <div className="stat">
                                  <p className="stat-value">{new Date(product.published).toLocaleDateString()}</p>
                                  <p className="stat-label">Publicado</p>
                                </div>
                              </div>

                              {/* Tags */}
                              <div className="product-tags">
                                {product.tags.map((tag, tagIndex) => (
                                  <span key={tagIndex} className="tag">
                                    {tag}
                                  </span>
                                ))}
                              </div>

                              {/* Action Buttons */}
                              <div className="product-actions">
                                <button
                                  onClick={() => handleProductAction(product, 'edit')}
                                  className="action-button edit"
                                >
                                  <Edit className="action-icon" />
                                  Editar
                                </button>
                                <button
                                  onClick={() => handleProductAction(product, 'discount')}
                                  className="action-button discount"
                                >
                                  <Percent className="action-icon" />
                                  Descuento
                                </button>
                                <button
                                  onClick={() => handleProductDelete(product.id)}
                                  className="action-button delete"
                                >
                                  <Trash2 className="action-icon" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {totalPages > 1 && (
                    <button
                      className="carousel-arrow carousel-arrow-right"
                      onClick={handleNextPage}
                      aria-label="Siguiente"
                    >
                      <ChevronRight className="arrow-icon" />
                    </button>
                  )}
                  
                  {/* Indicadores de página */}
                  {totalPages > 1 && (
                    <div className="carousel-indicators">
                      {Array.from({ length: totalPages }).map((_, idx) => (
                        <button
                          key={idx}
                          className={`indicator${productPage === idx ? ' active' : ''}`}
                          onClick={() => setProductPage(idx)}
                          aria-label={`Ir a la página ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="empty-products">
                  <div className="empty-icon">📦</div>
                  <h3 className="empty-title">No hay productos que mostrar</h3>
                  <p className="empty-description">
                    {selectedCategoryFilter !== 'all' 
                      ? `No hay productos en la categoría "${categories.find(c => c.id === selectedCategoryFilter)?.name}".`
                      : 'Selecciona una categoría para ver los productos disponibles.'
                    }
                  </p>
                </div>
              )}
            </div>

            {/* Current Offers */}
            {offers.length > 0 && (
              <div className="offers-section">
                <h2 className="offers-title">Ofertas Activas</h2>
                <div className="offers-grid">
                  {offers.map((offer) => (
                    <div key={offer.id} className="offer-card">
                      <div className="offer-content">
                        <div className="offer-header">
                          <Tag className="offer-icon" />
                          <span className="offer-name">{offer.name || 'Oferta sin nombre'}</span>
                          <span className="offer-type">
                            {offer.type === 'category' ? 'Categoría' : 'Producto'}
                          </span>
                        </div>
                        <p className="offer-detail">
                          <strong>Aplica a:</strong> {offer.targetName}
                        </p>
                        <p className="offer-detail">
                          <strong>Descuento:</strong> {offer.discountFrom}% - {offer.discountTo}%
                        </p>
                        {offer.validFrom && offer.validTo && (
                          <p className="offer-detail">
                            <strong>Válido:</strong> {offer.validFrom} - {offer.validTo}
                          </p>
                        )}
                        <p className="offer-date">Creado: {offer.createdAt}</p>
                      </div>
                      <button
                        onClick={() => deleteOffer(offer.id)}
                        className="delete-offer"
                      >
                        <X className="delete-icon" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
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

            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Nombre de la Oferta</label>
                <input
                  type="text"
                  value={offerName}
                  onChange={(e) => setOfferName(e.target.value)}
                  className="form-input"
                  placeholder="Ej: Descuento de Temporada"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tipo de Oferta</label>
                <div className="radio-group">
                  <label className="radio-item">
                    <input
                      type="radio"
                      value="category"
                      checked={offerType === 'category'}
                      onChange={(e) => setOfferType(e.target.value)}
                      className="radio-input"
                    />
                    <Package className="radio-icon" />
                    Por Categoría
                  </label>
                  <label className="radio-item">
                    <input
                      type="radio"
                      value="product"
                      checked={offerType === 'product'}
                      onChange={(e) => setOfferType(e.target.value)}
                      className="radio-input"
                    />
                    <Tag className="radio-icon" />
                    Por Producto
                  </label>
                </div>
              </div>

              {offerType === 'category' ? (
                <div className="form-group">
                  <label className="form-label">Seleccionar Categoría</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="form-select"
                  >
                    <option value="">Seleccionar categoría...</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="form-group">
                  <label className="form-label">Seleccionar Producto</label>
                  <div className="product-selector">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => setSelectedProduct(product)}
                        className={`product-option ${selectedProduct?.id === product.id ? 'selected' : ''}`}
                      >
                        <div className="product-option-content">
                          <img src={product.image} alt={product.name} className="product-option-image" />
                          <div className="product-option-info">
                            <p className="product-option-name">{product.name}</p>
                            <p className="product-option-price">${product.price.toFixed(2)}</p>
                          </div>
                        </div>
                        {selectedProduct?.id === product.id && (
                          <div className="selected-indicator"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">
                  <Percent className="label-icon" />
                  Rango de Descuento
                </label>
                <div className="discount-range">
                  <div className="discount-input">
                    <input
                      type="number"
                      value={discountFrom}
                      onChange={(e) => setDiscountFrom(e.target.value)}
                      placeholder="5"
                      className="form-input"
                    />
                    <span className="input-label">Desde %</span>
                  </div>
                  <span className="range-separator">-</span>
                  <div className="discount-input">
                    <input
                      type="number"
                      value={discountTo}
                      onChange={(e) => setDiscountTo(e.target.value)}
                      placeholder="50"
                      className="form-input"
                    />
                    <span className="input-label">Hasta %</span>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Calendar className="label-icon" />
                  Período de Validez
                </label>
                <div className="date-range">
                  <div className="date-input">
                    <input
                      type="date"
                      value={validFrom}
                      onChange={(e) => setValidFrom(e.target.value)}
                      className="form-input"
                    />
                    <span className="input-label">Desde</span>
                  </div>
                  <div className="date-input">
                    <input
                      type="date"
                      value={validTo}
                      onChange={(e) => setValidTo(e.target.value)}
                      className="form-input"
                    />
                    <span className="input-label">Hasta</span>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button onClick={() => setShowAddModal(false)} className="button secondary">
                  Cancelar
                </button>
                <button onClick={handleCreateOffer} className="button primary">
                  Crear Oferta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para acciones de producto */}
      {showProductModal && selectedProduct && (
        <div className="modal-overlay">
          <div className="modal-content modal-small">
            <div className="modal-header">
              <h2 className="modal-title">
                {actionType === 'edit' ? 'Editar Producto' : 
                 actionType === 'discount' ? 'Aplicar Descuento' : 'Acción de Producto'}
              </h2>
              <button onClick={() => setShowProductModal(false)} className="modal-close">
                <X className="close-icon" />
              </button>
            </div>

            <div className="product-preview">
              <div className="preview-content">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name}
                  className="preview-image"
                />
                <div className="preview-info">
                  <h3 className="preview-name">{selectedProduct.name}</h3>
                  <p className="preview-price">${selectedProduct.price.toFixed(2)}</p>
                  <p className="preview-stock">Stock: {selectedProduct.stock}</p>
                </div>
              </div>
            </div>

            <div className="modal-body">
              {actionType === 'edit' ? (
                <div className="edit-form">
                  <div className="form-group">
                    <label className="form-label">Nombre del Producto</label>
                    <input
                      type="text"
                      value={editingProduct.name || ''}
                      onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Descripción</label>
                    <textarea
                      value={editingProduct.description || ''}
                      onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                      rows={3}
                      className="form-textarea"
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Precio ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={editingProduct.price || ''}
                        onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Stock</label>
                      <input
                        type="number"
                        value={editingProduct.stock || ''}
                        onChange={(e) => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>
              ) : actionType === 'discount' ? (
                <div className="discount-form">
                  <div className="form-group">
                    <label className="form-label">
                      <Percent className="label-icon" />
                      Porcentaje de Descuento
                    </label>
                    <input
                      type="number"
                      value={discountFrom}
                      onChange={(e) => setDiscountFrom(e.target.value)}
                      placeholder="Ej: 15"
                      min="0"
                      max="90"
                      className="form-input"
                    />
                    <span className="input-help">Ingresa el porcentaje de descuento (0-90%)</span>
                  </div>
                  
                  {discountFrom && (
                    <div className="discount-preview">
                      <h4 className="preview-title">Vista Previa del Descuento</h4>
                      <div className="preview-calculations">
                        <div className="calc-item">
                          <p className="calc-label">Precio Original:</p>
                          <p className="calc-value original">${selectedProduct.originalPrice.toFixed(2)}</p>
                        </div>
                        <div className="calc-item">
                          <p className="calc-label">Descuento:</p>
                          <p className="calc-value discount">-{discountFrom}%</p>
                        </div>
                        <div className="calc-item">
                          <p className="calc-label">Precio Final:</p>
                          <p className="calc-value final">
                            ${(selectedProduct.originalPrice * (1 - parseInt(discountFrom || 0) / 100)).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label">
                      <Calendar className="label-icon" />
                      Vigencia del Descuento (Opcional)
                    </label>
                    <div className="date-range">
                      <div className="date-input">
                        <input
                          type="date"
                          value={validFrom}
                          onChange={(e) => setValidFrom(e.target.value)}
                          className="form-input"
                        />
                        <span className="input-label">Desde</span>
                      </div>
                      <div className="date-input">
                        <input
                          type="date"
                          value={validTo}
                          onChange={(e) => setValidTo(e.target.value)}
                          className="form-input"
                        />
                        <span className="input-label">Hasta</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="modal-actions">
                <button onClick={() => setShowProductModal(false)} className="button secondary">
                  Cancelar
                </button>
                <button
                  onClick={handleProductUpdate}
                  className={`button ${actionType === 'edit' ? 'primary' : 'success'}`}
                >
                  {actionType === 'edit' ? (
                    <>
                      <Edit className="button-icon" />
                      Actualizar Producto
                    </>
                  ) : (
                    <>
                      <Percent className="button-icon" />
                      Aplicar Descuento
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferManager;