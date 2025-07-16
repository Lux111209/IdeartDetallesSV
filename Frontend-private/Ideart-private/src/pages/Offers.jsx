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

  const [productPage, setProductPage] = useState(0);

  // API Configuration
  const API_URL = 'http://localhost:5000/api';

  // Función simple de fetch
  const fetchData = async (url) => {
    try {
      console.log('Fetching:', url);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
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

  // Función para crear oferta
  const createOffer = async (offerData) => {
    try {
      console.log('Creating offer:', offerData);
      const response = await fetch(`${API_URL}/ofertas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(offerData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Create response:', data);
      return data;
    } catch (error) {
      console.error('Create error:', error);
      throw error;
    }
  };

  // Función para eliminar oferta
  const deleteOfferAPI = async (id) => {
    try {
      console.log('Deleting offer:', id);
      const response = await fetch(`${API_URL}/ofertas/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
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

  // Cargar productos y ofertas del backend
  const loadData = async () => {
    setLoading(true);
    
    try {
      // Cargar productos
      const productosData = await fetchData(`${API_URL}/products`);
      console.log('Productos cargados:', productosData);
      
      // Transformar productos del backend al formato del frontend
      const productosFormateados = productosData.map(product => ({
        id: product._id,
        name: product.name || 'Producto sin nombre',
        description: product.description || 'Sin descripción',
        price: product.price || 0,
        originalPrice: product.price || 0, // Usar el mismo precio como original
        category: product.productType || 'general',
        stock: product.stock || 0,
        orders: Math.floor(Math.random() * 50), // Simular órdenes ya que no tienes este campo
        published: product.createdAt || new Date(),
        image: product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
        rating: (Math.random() * 2 + 3).toFixed(1), // Rating aleatorio entre 3-5
        reviews: Math.floor(Math.random() * 30) + 5, // Reviews aleatorias
        discount: 0, // Sin descuento inicial
        featured: Math.random() > 0.7, // 30% chance de ser destacado
        tags: product.tags || [],
        // Guardar datos originales para referencia
        originalData: product
      }));

      setProducts(productosFormateados);
      setFilteredProducts(productosFormateados);

      // Cargar ofertas
      const ofertasData = await fetchData(`${API_URL}/ofertas`);
      console.log('Ofertas cargadas:', ofertasData);
      
      // Transformar ofertas del backend al formato del frontend
      const ofertasFormateadas = ofertasData.map(offer => ({
        id: offer._id,
        name: offer.nombreOferta || 'Oferta sin nombre',
        type: 'product', // Ajustar según tu lógica
        target: offer.productos?.[0] || null,
        targetName: offer.productos?.length > 0 ? `${offer.productos.length} producto(s)` : 'Sin productos',
        discountFrom: offer.DescuentoRealizado || 0,
        discountTo: offer.DescuentoRealizado || 0,
        validFrom: offer.creada ? new Date(offer.creada).toLocaleDateString() : '',
        validTo: offer.expirada ? new Date(offer.expirada).toLocaleDateString() : '',
        active: offer.activa || false,
        createdAt: offer.creada ? new Date(offer.creada).toLocaleDateString() : '',
        originalData: offer
      }));

      setOffers(ofertasFormateadas);

    } catch (error) {
      console.error('Error cargando datos:', error);
      alert('Error al cargar los datos del servidor');
    } finally {
      setLoading(false);
    }
  };

  // useEffect para cargar datos al inicio
  useEffect(() => {
    loadData();
  }, []);

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
    { id: 'electronics', name: 'Electrónicos', icon: '📱' },
    { id: 'clothing', name: 'Ropa', icon: '👕' },
    { id: 'home', name: 'Hogar', icon: '🏠' },
    { id: 'books', name: 'Libros', icon: '📚' },
    { id: 'sports', name: 'Deportes', icon: '⚽' },
    { id: 'beauty', name: 'Belleza', icon: '💄' },
    { id: 'toys', name: 'Juguetes', icon: '🧸' },
    { id: 'food', name: 'Alimentos', icon: '🍎' }
  ];

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategoryFilter(categoryId);
  };

  const handleCategoryDiscount = (categoryId) => {
    const categoryName = categories.find(c => c.id === categoryId)?.name;
    const productosEnCategoria = products.filter(p => p.category === categoryId);
    
    if (productosEnCategoria.length === 0) {
      alert(`No hay productos disponibles en la categoría "${categoryName}". No se puede crear una oferta.`);
      return;
    }
    
    setSelectedCategory(categoryId);
    setOfferType('category');
    setOfferName(`Descuento ${categoryName}`);
    setDiscountFrom('15'); 
    
    // Mostrar confirmación
    console.log(`Preparando oferta para categoría "${categoryName}" con ${productosEnCategoria.length} productos:`, 
      productosEnCategoria.map(p => p.name));
    
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

  const handleCreateOffer = async () => {
    try {
      // Validaciones
      if (!offerName.trim()) {
        alert('Por favor ingresa un nombre para la oferta');
        return;
      }

      if (offerType === 'category' && !selectedCategory) {
        alert('Por favor selecciona una categoría');
        return;
      }

      if (offerType === 'product' && !selectedProduct) {
        alert('Por favor selecciona un producto');
        return;
      }

      if (!discountFrom || parseInt(discountFrom) <= 0 || parseInt(discountFrom) > 100) {
        alert('Por favor ingresa un descuento válido (1-100%)');
        return;
      }

      if (!validTo) {
        alert('Por favor selecciona una fecha de expiración');
        return;
      }

      // Obtener productos según el tipo de oferta
      let productosOferta = [];
      let targetName = '';
      
      if (offerType === 'category') {
        // Filtrar productos por categoría
        const productosCategoria = products.filter(p => p.category === selectedCategory);
        productosOferta = productosCategoria.map(p => p.id);
        targetName = `Categoría: ${categories.find(c => c.id === selectedCategory)?.name} (${productosCategoria.length} productos)`;
        
        if (productosCategoria.length === 0) {
          alert(`No hay productos disponibles en la categoría "${categories.find(c => c.id === selectedCategory)?.name}"`);
          return;
        }
        
        console.log(`Aplicando oferta a categoría "${selectedCategory}":`, productosCategoria.map(p => p.name));
      } else {
        // Un solo producto
        productosOferta = [selectedProduct.id];
        targetName = `Producto: ${selectedProduct.name}`;
        
        console.log(`Aplicando oferta a producto:`, selectedProduct.name);
      }

      // Crear objeto de oferta para el backend
      const ofertaData = {
        nombreOferta: offerName.trim(),
        DescuentoRealizado: parseInt(discountFrom),
        productos: productosOferta,
        expirada: validTo,
        activa: true
      };

      console.log('Enviando oferta al backend:', ofertaData);

      // Enviar al backend
      const response = await createOffer(ofertaData);
      
      if (response.success) {
        // Crear oferta local para mostrar inmediatamente
        const newLocalOffer = {
          id: response.data._id,
          name: offerName.trim(),
          type: offerType,
          target: offerType === 'category' ? selectedCategory : selectedProduct.id,
          targetName: targetName,
          discountFrom: parseInt(discountFrom),
          discountTo: parseInt(discountFrom),
          validFrom: new Date().toLocaleDateString(),
          validTo: new Date(validTo).toLocaleDateString(),
          active: true,
          createdAt: new Date().toLocaleDateString(),
          originalData: response.data
        };

        // Agregar a la lista local
        setOffers(prevOffers => [...prevOffers, newLocalOffer]);

        // Aplicar descuento a productos localmente para vista previa
        if (offerType === 'category') {
          const updatedProducts = products.map(product => {
            if (product.category === selectedCategory) {
              return {
                ...product,
                discount: parseInt(discountFrom),
                price: product.originalPrice * (1 - parseInt(discountFrom) / 100)
              };
            }
            return product;
          });
          setProducts(updatedProducts);
        } else {
          const updatedProducts = products.map(product => {
            if (product.id === selectedProduct.id) {
              return {
                ...product,
                discount: parseInt(discountFrom),
                price: product.originalPrice * (1 - parseInt(discountFrom) / 100)
              };
            }
            return product;
          });
          setProducts(updatedProducts);
        }

        alert(` Oferta creada exitosamente!\n\n Nombre: ${offerName}\n Aplica a: ${targetName}\n Descuento: ${discountFrom}%\n Válida hasta: ${new Date(validTo).toLocaleDateString()}`);
        
        setShowAddModal(false);
        resetForm();
      } else {
        alert('Error al crear la oferta: ' + (response.message || 'Error desconocido'));
      }

    } catch (error) {
      console.error('Error creando oferta:', error);
      alert('Error al crear la oferta: ' + error.message);
    }
  };

  const deleteOffer = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta oferta?')) {
      const success = await deleteOfferAPI(id);
      
      if (success) {
        setOffers(offers.filter(offer => offer.id !== id));
        alert('✅ Oferta eliminada exitosamente');
      } else {
        alert('Error al eliminar la oferta');
      }
    }
  };

  if (loading) {
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

            {/* Action Buttons */}
            <div className="action-section">
              <button onClick={() => setShowAddModal(true)} className="add-button">
                <Plus className="button-icon" />
                Agregar Oferta
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
                <h2 className="offers-title">Ofertas Activas ({offers.length})</h2>
                <div className="offers-grid">
                  {offers.map((offer) => (
                    <div key={offer.id} className="offer-card">
                      <div className="offer-content">
                        <div className="offer-header">
                          <Tag className="offer-icon" />
                          <span className="offer-name">{offer.name}</span>
                          <span className="offer-type">
                            {offer.type === 'category' ? 'Categoría' : 'Producto'}
                          </span>
                        </div>
                        <p className="offer-detail">
                          <strong>Aplica a:</strong> {offer.targetName}
                        </p>
                        <p className="offer-detail">
                          <strong>Descuento:</strong> {offer.discountFrom}%
                        </p>
                        <p className="offer-detail">
                          <strong>Válido hasta:</strong> {offer.validTo}
                        </p>
                        <p className="offer-date">Creado: {offer.createdAt}</p>
                        <p className="offer-detail">
                          <strong>Estado:</strong> 
                          <span style={{color: offer.active ? '#16a34a' : '#ef4444'}}>
                            {offer.active ? ' Activa' : ' Inactiva'}
                          </span>
                        </p>
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
                    {categories.map((category) => {
                      const productosEnCategoria = products.filter(p => p.category === category.id);
                      return (
                        <option key={category.id} value={category.id}>
                          {category.name} ({productosEnCategoria.length} productos)
                        </option>
                      );
                    })}
                  </select>
                  {selectedCategory && (
                    <div className="category-preview" style={{
                      marginTop: '1rem',
                      padding: '1rem',
                      backgroundColor: '#f0f9ff',
                      borderRadius: '0.5rem',
                      border: '1px solid #bae6fd'
                    }}>
                      <h4 style={{ marginBottom: '0.5rem', color: '#0369a1' }}>
                        Vista previa de la categoría seleccionada:
                      </h4>
                      <p style={{ color: '#0c4a6e', marginBottom: '0.5rem' }}>
                        <strong>{categories.find(c => c.id === selectedCategory)?.name}</strong>
                      </p>
                      <p style={{ color: '#0c4a6e', fontSize: '0.875rem' }}>
                        Productos que recibirán el descuento: {products.filter(p => p.category === selectedCategory).length}
                      </p>
                      {products.filter(p => p.category === selectedCategory).length > 0 && (
                        <div style={{ marginTop: '0.5rem' }}>
                          <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>
                            Algunos productos incluidos:
                          </p>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            {products
                              .filter(p => p.category === selectedCategory)
                              .slice(0, 3)
                              .map(p => p.name)
                              .join(', ')}
                            {products.filter(p => p.category === selectedCategory).length > 3 && '...'}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="form-group">
                  <label className="form-label">Seleccionar Producto</label>
                  <div className="product-selector">
                    {products.length > 0 ? products.map((product) => (
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
                            <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                              Categoría: {categories.find(c => c.id === product.category)?.name || product.category}
                            </p>
                            <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                              Stock: {product.stock} | Rating: {product.rating}⭐
                            </p>
                          </div>
                        </div>
                        {selectedProduct?.id === product.id && (
                          <div className="selected-indicator"></div>
                        )}
                      </div>
                    )) : (
                      <div style={{ 
                        textAlign: 'center', 
                        padding: '2rem', 
                        color: '#6b7280',
                        backgroundColor: '#f9fafb',
                        borderRadius: '0.5rem'
                      }}>
                        <p>No hay productos disponibles</p>
                        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                          Asegúrate de que el backend esté conectado y tenga productos
                        </p>
                      </div>
                    )}
                  </div>
                  {selectedProduct && (
                    <div className="product-preview" style={{
                      marginTop: '1rem',
                      padding: '1rem',
                      backgroundColor: '#f0fdf4',
                      borderRadius: '0.5rem',
                      border: '1px solid #bbf7d0'
                    }}>
                      <h4 style={{ marginBottom: '0.5rem', color: '#166534' }}>
                        Producto seleccionado:
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img 
                          src={selectedProduct.image} 
                          alt={selectedProduct.name}
                          style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '0.5rem' }}
                        />
                        <div>
                          <p style={{ fontWeight: '600', color: '#14532d' }}>{selectedProduct.name}</p>
                          <p style={{ color: '#166534', fontSize: '0.875rem' }}>
                            Precio actual: ${selectedProduct.price.toFixed(2)}
                          </p>
                          <p style={{ color: '#166534', fontSize: '0.875rem' }}>
                            Stock disponible: {selectedProduct.stock}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

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
                  min="1"
                  max="100"
                  className="form-input"
                />
                <span className="input-help">Ingresa el porcentaje de descuento (1-100%)</span>
                
                {/* Vista previa del descuento */}
                {discountFrom && (offerType === 'category' ? selectedCategory : selectedProduct) && (
                  <div className="discount-preview" style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    backgroundColor: '#fef3c7',
                    borderRadius: '0.5rem',
                    border: '1px solid #fbbf24'
                  }}>
                    <h4 style={{ marginBottom: '0.5rem', color: '#92400e' }}>
                      📊 Vista previa del descuento:
                    </h4>
                    
                    {offerType === 'category' ? (
                      <div>
                        <p style={{ color: '#92400e', marginBottom: '0.5rem' }}>
                          <strong>Categoría:</strong> {categories.find(c => c.id === selectedCategory)?.name}
                        </p>
                        <p style={{ color: '#92400e', marginBottom: '0.5rem' }}>
                          <strong>Productos afectados:</strong> {products.filter(p => p.category === selectedCategory).length}
                        </p>
                        <p style={{ color: '#92400e', fontSize: '0.875rem' }}>
                          <strong>Descuento aplicado:</strong> {discountFrom}% en todos los productos de la categoría
                        </p>
                        {products.filter(p => p.category === selectedCategory).length > 0 && (
                          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
                            <p style={{ color: '#78350f', marginBottom: '0.25rem' }}>Ejemplo con algunos productos:</p>
                            {products
                              .filter(p => p.category === selectedCategory)
                              .slice(0, 2)
                              .map((product, index) => (
                                <div key={index} style={{ 
                                  display: 'flex', 
                                  justifyContent: 'space-between',
                                  color: '#78350f',
                                  marginBottom: '0.25rem'
                                }}>
                                  <span>{product.name}</span>
                                  <span>
                                    ${product.originalPrice.toFixed(2)} → ${(product.originalPrice * (1 - parseInt(discountFrom) / 100)).toFixed(2)}
                                  </span>
                                </div>
                              ))
                            }
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <p style={{ color: '#92400e', marginBottom: '0.5rem' }}>
                          <strong>Producto:</strong> {selectedProduct.name}
                        </p>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          backgroundColor: 'white',
                          padding: '0.5rem',
                          borderRadius: '0.25rem',
                          marginTop: '0.5rem'
                        }}>
                          <div>
                            <p style={{ margin: 0, color: '#374151' }}>
                              <strong>Precio original:</strong> ${selectedProduct.originalPrice.toFixed(2)}
                            </p>
                            <p style={{ margin: 0, color: '#dc2626' }}>
                              <strong>Descuento:</strong> -{discountFrom}%
                            </p>
                            <p style={{ margin: 0, color: '#16a34a', fontWeight: 'bold' }}>
                              <strong>Precio final:</strong> ${(selectedProduct.originalPrice * (1 - parseInt(discountFrom) / 100)).toFixed(2)}
                            </p>
                          </div>
                          <div style={{ fontSize: '1.5rem' }}>💰</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Calendar className="label-icon" />
                  Fecha de Expiración
                </label>
                <input
                  type="date"
                  value={validTo}
                  onChange={(e) => setValidTo(e.target.value)}
                  className="form-input"
                  min={new Date().toISOString().split('T')[0]}
                />
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