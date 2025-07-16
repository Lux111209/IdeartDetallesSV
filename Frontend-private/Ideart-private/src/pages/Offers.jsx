import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search, Filter, X, Plus, Edit, Trash2, Tag, Package, Calendar, Percent, ShoppingCart, Eye, Star } from 'lucide-react';
import Sidebar from "../components/Sidebar";
import '../css/OfferManager.css'; 

const OfferManager = () => {
  // Estados principales para modales
  const [showAddModal, setShowAddModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  
  // Estados para formularios de ofertas
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [discountFrom, setDiscountFrom] = useState('');
  const [offerType, setOfferType] = useState('category');
  const [offerName, setOfferName] = useState('');
  const [validTo, setValidTo] = useState('');
  const [actionType, setActionType] = useState('');
  
  // Estados para datos
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState({});
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [offers, setOffers] = useState([]);

  // Configuración de la API
  const API_URL = 'http://localhost:5000/api';

  /**
   * Función auxiliar para hacer peticiones GET al backend
   * @param {string} url - URL del endpoint
   * @returns {Array} - Datos obtenidos o array vacío en caso de error
   */
  const fetchData = async (url) => {
    try {
      console.log('Fetching:', url);
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
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

  /**
   * Función para crear una nueva oferta en el backend
   * @param {Object} offerData - Datos de la oferta a crear
   * @returns {Object} - Respuesta del servidor
   */
  const createOffer = async (offerData) => {
    try {
      console.log('Creating offer:', offerData);
      const response = await fetch(`${API_URL}/ofertas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

  /**
   * Función para eliminar una oferta del backend
   * @param {string} id - ID de la oferta a eliminar
   * @returns {boolean} - true si se eliminó correctamente
   */
  const deleteOfferAPI = async (id) => {
    try {
      console.log('Deleting offer:', id);
      const response = await fetch(`${API_URL}/ofertas/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
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

  /**
   * Función principal para cargar productos y ofertas del backend al iniciar
   */
  const loadData = async () => {
    setLoading(true);
    
    try {
      // Cargar productos del backend
      const productosData = await fetchData(`${API_URL}/products`);
      console.log('Productos cargados:', productosData);
      
      // Transformar datos del backend al formato que espera el frontend
      const productosFormateados = productosData.map(product => ({
        id: product._id,
        name: product.name || 'Producto sin nombre',
        description: product.description || 'Sin descripción',
        price: product.price || 0,
        originalPrice: product.price || 0,
        category: product.productType || 'general',
        stock: product.stock || 0,
        orders: Math.floor(Math.random() * 50), // Datos simulados
        published: product.createdAt || new Date(),
        image: product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
        rating: (Math.random() * 2 + 3).toFixed(1), // Rating simulado 3-5
        reviews: Math.floor(Math.random() * 30) + 5, // Reviews simuladas
        discount: 0,
        featured: Math.random() > 0.7, // 30% chance de ser destacado
        tags: product.tags || [],
        originalData: product
      }));

      setProducts(productosFormateados);
      setFilteredProducts(productosFormateados);

      // Cargar ofertas del backend
      const ofertasData = await fetchData(`${API_URL}/ofertas`);
      console.log('Ofertas cargadas:', ofertasData);
      
      // Transformar ofertas del backend al formato del frontend
      const ofertasFormateadas = ofertasData.map(offer => ({
        id: offer._id,
        name: offer.nombreOferta || 'Oferta sin nombre',
        type: 'product',
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

  // Cargar datos al montar el componente
  useEffect(() => {
    loadData();
  }, []);

  /**
   * Filtrar productos cuando cambia la categoría seleccionada
   */
  useEffect(() => {
    if (selectedCategoryFilter === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.category === selectedCategoryFilter));
    }
  }, [selectedCategoryFilter, products]);

  // Definición de categorías disponibles
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

  /**
   * Manejar filtro de productos por categoría
   * @param {string} categoryId - ID de la categoría a filtrar
   */
  const handleCategoryFilter = (categoryId) => {
    setSelectedCategoryFilter(categoryId);
  };

  /**
   * Preparar una oferta de descuento para toda una categoría
   * @param {string} categoryId - ID de la categoría
   */
  const handleCategoryDiscount = (categoryId) => {
    const categoryName = categories.find(c => c.id === categoryId)?.name;
    const productosEnCategoria = products.filter(p => p.category === categoryId);
    
    // Validar que la categoría tenga productos
    if (productosEnCategoria.length === 0) {
      alert(`No hay productos disponibles en la categoría "${categoryName}". No se puede crear una oferta.`);
      return;
    }
    
    // Preparar formulario de oferta con datos predeterminados
    setSelectedCategory(categoryId);
    setOfferType('category');
    setOfferName(`Descuento ${categoryName}`);
    setDiscountFrom('15'); 
    
    console.log(`Preparando oferta para categoría "${categoryName}" con ${productosEnCategoria.length} productos:`, 
      productosEnCategoria.map(p => p.name));
    
    setShowAddModal(true);
  };

  /**
   * Manejar acciones sobre productos individuales (editar, descuento, etc.)
   * @param {Object} product - Producto seleccionado
   * @param {string} action - Tipo de acción ('edit', 'discount')
   */
  const handleProductAction = (product, action) => {
    setSelectedProduct(product);
    setActionType(action);
    
    if (action === 'edit') {
      // Preparar datos para edición
      setEditingProduct({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock
      });
    } else if (action === 'discount') {
      // Preparar datos para descuento
      setDiscountFrom(product.discount?.toString() || '');
    }
    
    setShowProductModal(true);
  };

  /**
   * Actualizar producto después de edición o aplicación de descuento
   */
  const handleProductUpdate = async () => {
    if (actionType === 'edit') {
      // Actualizar datos del producto
      const updatedProducts = products.map(p => 
        p.id === selectedProduct.id 
          ? { ...p, ...editingProduct }
          : p
      );
      setProducts(updatedProducts);
      alert('Producto actualizado exitosamente');
    } else if (actionType === 'discount') {
      // Aplicar descuento al producto
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

  /**
   * Eliminar producto con confirmación
   * @param {string} productId - ID del producto a eliminar
   */
  const handleProductDelete = async (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      const updatedProducts = products.filter(p => p.id !== productId);
      setProducts(updatedProducts);
      alert('Producto eliminado exitosamente');
    }
  };

  /**
   * Limpiar todos los campos del formulario
   */
  const resetForm = () => {
    setOfferName('');
    setSelectedCategory('');
    setSelectedProduct(null);
    setDiscountFrom('');
    setValidTo('');
    setOfferType('category');
    setActionType('');
    setEditingProduct({});
  };

  /**
   * Función principal para crear una nueva oferta
   */
  const handleCreateOffer = async () => {
    try {
      // Validaciones del formulario
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
        // Oferta por categoría - obtener todos los productos de esa categoría
        const productosCategoria = products.filter(p => p.category === selectedCategory);
        productosOferta = productosCategoria.map(p => p.id);
        targetName = `Categoría: ${categories.find(c => c.id === selectedCategory)?.name} (${productosCategoria.length} productos)`;
        
        if (productosCategoria.length === 0) {
          alert(`No hay productos disponibles en la categoría "${categories.find(c => c.id === selectedCategory)?.name}"`);
          return;
        }
        
        console.log(`Aplicando oferta a categoría "${selectedCategory}":`, productosCategoria.map(p => p.name));
      } else {
        // Oferta por producto individual
        productosOferta = [selectedProduct.id];
        targetName = `Producto: ${selectedProduct.name}`;
        console.log(`Aplicando oferta a producto:`, selectedProduct.name);
      }

      // Preparar datos para enviar al backend
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
        // Crear oferta local para mostrar inmediatamente en la UI
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

        // Agregar a la lista de ofertas
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

        alert(`✅ Oferta creada exitosamente!\n\n Nombre: ${offerName}\n Aplica a: ${targetName}\n Descuento: ${discountFrom}%\n Válida hasta: ${new Date(validTo).toLocaleDateString()}`);
        
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

  /**
   * Eliminar oferta con confirmación
   * @param {string} id - ID de la oferta a eliminar
   */
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

  // Mostrar pantalla de carga mientras se obtienen los datos
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
          
          {/* Header de la página */}
          <div className="header">
            <div className="header-content">
              <h1 className="header-title">Gestor de Ofertas</h1>
            </div>
          </div>

          {/* Botón para agregar nueva oferta */}
          <div className="action-section">
            <button onClick={() => setShowAddModal(true)} className="add-button">
              <Plus className="button-icon" />
              Agregar Oferta
            </button>
          </div>

          {/* Sección de categorías con filtros */}
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
            
            {/* Grid de categorías */}
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
            
            {/* Indicador de filtro activo */}
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

          {/* Sección de productos - Mostrar todos en grid */}
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

            {/* Grid de productos - Mostrar todos */}
            {filteredProducts.length > 0 ? (
              <div className="products-grid-static">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="product-card">
                    {/* Imagen del producto con badges */}
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

                    {/* Información del producto */}
                    <div className="product-info">
                      <h3 className="product-title">{product.name}</h3>
                      <p className="product-description">{product.description}</p>
                      
                      {/* Sección de precios y rating */}
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

                      {/* Estadísticas del producto */}
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

                      {/* Tags del producto */}
                      <div className="product-tags">
                        {product.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="tag">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Botones de acción */}
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
                ))}
              </div>
            ) : (
              // Mensaje cuando no hay productos que mostrar
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

          {/* Sección de ofertas activas */}
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

      {/* Modal para crear nueva oferta */}
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
              {/* Nombre de la oferta */}
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

              {/* Tipo de oferta */}
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

              {/* Selector de categoría o producto según el tipo */}
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
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Porcentaje de descuento */}
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
              </div>

              {/* Fecha de expiración */}
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

              {/* Botones de acción */}
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

      {/* Modal para acciones de producto (editar/descuento) */}
      {showProductModal && selectedProduct && (
        <div className="modal-overlay">
          <div className="modal-content modal-small">
            <div className="modal-header">
              <h2 className="modal-title">
                {actionType === 'edit' ? 'Editar Producto' : 'Aplicar Descuento'}
              </h2>
              <button onClick={() => setShowProductModal(false)} className="modal-close">
                <X className="close-icon" />
              </button>
            </div>

            {/* Vista previa del producto seleccionado */}
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
                // Formulario de edición
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
              ) : (
                // Formulario de descuento
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
                </div>
              )}

              {/* Botones de acción */}
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