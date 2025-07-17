import React, { useState, useEffect } from 'react';
import '../css/ProductModal.css';

const ProductModal = ({ product, onClose, onSave, onDelete, loading = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    productType: '',
    subType: '',
    usageCategory: '',
    color: '',
    size: '',
    description: '',
    stock: '',
    price: '',
    material: '',
    tags: ''
  });
  
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});

  // Tipos de productos predefinidos
  const productTypes = [
    'Ropa', 'Camisas', 'Pantalones', 'Vestidos',
    'Accesorios', 'Tecnología', 'Electrónicos', 'Celulares',
    'Hogar', 'Muebles', 'Decoración', 'Cocina',
    'Libros', 'Literatura', 'Educación',
    'Deportes', 'Fitness', 'Aire libre',
    'Belleza', 'Cosméticos', 'Cuidado personal',
    'Juguetes', 'Infantil', 'Bebés',
    'Alimentos', 'Bebidas', 'Comida'
  ];

  // Cargar datos del producto cuando cambie
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        productType: product.productType || '',
        subType: product.subType || '',
        usageCategory: product.usageCategory || '',
        color: product.color || '',
        size: product.size || '',
        description: product.description || '',
        stock: product.stock?.toString() || '0',
        price: product.price?.toString() || '0',
        material: product.material || '',
        tags: Array.isArray(product.tags) ? product.tags.join(', ') : ''
      });
    }
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 5) {
      alert('Máximo 5 imágenes permitidas');
      return;
    }

    // Validar tipos de archivo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const invalidFiles = files.filter(file => !allowedTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      alert('Solo se permiten archivos JPG, PNG y JPEG');
      return;
    }

    // Validar tamaño de archivo (máximo 5MB por imagen)
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    
    if (oversizedFiles.length > 0) {
      alert('Cada imagen debe ser menor a 5MB');
      return;
    }

    setNewImages(files);

    // Crear previsualizaciones
    const previews = files.map(file => URL.createObjectURL(file));
    setNewImagePreviews(previews);
  };

  const removeNewImage = (index) => {
    const filteredImages = newImages.filter((_, i) => i !== index);
    const filteredPreviews = newImagePreviews.filter((_, i) => i !== index);
    
    setNewImages(filteredImages);
    setNewImagePreviews(filteredPreviews);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    if (!formData.productType.trim()) {
      newErrors.productType = 'El tipo de producto es obligatorio';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'El precio es obligatorio';
    } else if (isNaN(formData.price) || parseFloat(formData.price) < 0) {
      newErrors.price = 'El precio debe ser un número mayor o igual a 0';
    }

    if (!formData.stock.trim()) {
      newErrors.stock = 'El stock es obligatorio';
    } else if (isNaN(formData.stock) || parseInt(formData.stock) < 0) {
      newErrors.stock = 'El stock debe ser un número mayor o igual a 0';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      // Preparar datos del producto
      const updatedProduct = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
      };

      // Agregar nuevas imágenes si las hay
      if (newImages.length > 0) {
        updatedProduct.newImages = newImages;
      }

      await onSave(updatedProduct);
      setIsEditing(false);
    } catch (error) {
      console.error('Error al guardar producto:', error);
      alert('Error al guardar producto: ' + error.message);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await onDelete(product.id || product._id);
      } catch (error) {
        console.error('Error al eliminar producto:', error);
        alert('Error al eliminar producto: ' + error.message);
      }
    }
  };

  const handleClose = () => {
    // Limpiar URLs de vista previa para evitar memory leaks
    newImagePreviews.forEach(url => URL.revokeObjectURL(url));
    setIsEditing(false);
    onClose();
  };

  if (!product) return null;

  return (
    <div className="popup-fullscreen">
      <div className="popup-container" style={{ maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
        <button className="popup-close" onClick={handleClose} disabled={loading}>
          ✕
        </button>
        
        <h2>{isEditing ? 'Editar Producto' : 'Detalles del Producto'}</h2>
        
        {!isEditing ? (
          // Vista de solo lectura
          <div>
            {/* Imágenes del producto */}
            {product.images && product.images.length > 0 && (
              <div className="img-preview" style={{ marginBottom: '20px' }}>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
                  gap: '10px',
                  marginBottom: '15px'
                }}>
                  {product.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '150px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '2px solid #ddd'
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Información del producto */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <h3 style={{ color: '#333', marginBottom: '15px' }}>Información Básica</h3>
                <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                  <p><strong>Nombre:</strong> {product.name}</p>
                  <p><strong>Tipo:</strong> {product.productType}</p>
                  <p><strong>Precio:</strong> ${parseFloat(product.price || 0).toFixed(2)}</p>
                  <p><strong>Stock:</strong> {product.stock}</p>
                  <p><strong>Estado:</strong> 
                    <span style={{ 
                      color: product.stock > 0 ? '#28a745' : '#dc3545',
                      fontWeight: 'bold',
                      marginLeft: '5px'
                    }}>
                      {product.stock > 0 ? 'Disponible' : 'Sin Stock'}
                    </span>
                  </p>
                </div>
              </div>
              
              <div>
                <h3 style={{ color: '#333', marginBottom: '15px' }}>Detalles Adicionales</h3>
                <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                  {product.subType && <p><strong>Subtipo:</strong> {product.subType}</p>}
                  {product.color && <p><strong>Color:</strong> {product.color}</p>}
                  {product.size && <p><strong>Talla/Tamaño:</strong> {product.size}</p>}
                  {product.material && <p><strong>Material:</strong> {product.material}</p>}
                  {product.usageCategory && <p><strong>Categoría de Uso:</strong> {product.usageCategory}</p>}
                </div>
              </div>
            </div>

            {/* Descripción */}
            {product.description && (
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: '#333', marginBottom: '10px' }}>Descripción</h3>
                <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                  <p style={{ lineHeight: '1.6', margin: 0 }}>{product.description}</p>
                </div>
              </div>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: '#333', marginBottom: '10px' }}>Etiquetas</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {product.tags.map((tag, index) => (
                    <span
                      key={index}
                      style={{
                        background: '#007bff',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '14px'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Botones de acción */}
            <div className="popup-actions">
              <button 
                className="cancel" 
                onClick={handleDelete}
                disabled={loading}
                style={{ background: '#dc3545' }}
              >
                {loading ? 'Eliminando...' : 'Eliminar'}
              </button>
              <button 
                className="save" 
                onClick={() => setIsEditing(true)}
                disabled={loading}
              >
                Editar
              </button>
            </div>
          </div>
        ) : (
          // Vista de edición
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            {/* Información básica */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '15px', color: '#333', borderBottom: '2px solid #eee', paddingBottom: '5px' }}>
                Información Básica
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Nombre del Producto *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={loading}
                    style={{ width: '100%' }}
                  />
                  {errors.name && <span className="error">{errors.name}</span>}
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Tipo de Producto *
                  </label>
                  <select
                    name="productType"
                    value={formData.productType}
                    onChange={handleInputChange}
                    disabled={loading}
                    style={{ width: '100%', padding: '10px', border: '1.8px solid #ccc', borderRadius: '8px' }}
                  >
                    <option value="">Seleccionar tipo...</option>
                    {productTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.productType && <span className="error">{errors.productType}</span>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Precio ($) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    disabled={loading}
                    style={{ width: '100%' }}
                  />
                  {errors.price && <span className="error">{errors.price}</span>}
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Stock *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                    disabled={loading}
                    style={{ width: '100%' }}
                  />
                  {errors.stock && <span className="error">{errors.stock}</span>}
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Descripción *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  disabled={loading}
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: '1.8px solid #ccc', 
                    borderRadius: '8px',
                    resize: 'vertical'
                  }}
                />
                {errors.description && <span className="error">{errors.description}</span>}
              </div>
            </div>

            {/* Detalles adicionales */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '15px', color: '#333', borderBottom: '2px solid #eee', paddingBottom: '5px' }}>
                Detalles Adicionales
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Subtipo
                  </label>
                  <input
                    type="text"
                    name="subType"
                    value={formData.subType}
                    onChange={handleInputChange}
                    disabled={loading}
                    style={{ width: '100%' }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Color
                  </label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    disabled={loading}
                    style={{ width: '100%' }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Talla/Tamaño
                  </label>
                  <input
                    type="text"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    disabled={loading}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Material
                  </label>
                  <input
                    type="text"
                    name="material"
                    value={formData.material}
                    onChange={handleInputChange}
                    disabled={loading}
                    style={{ width: '100%' }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Categoría de Uso
                  </label>
                  <input
                    type="text"
                    name="usageCategory"
                    value={formData.usageCategory}
                    onChange={handleInputChange}
                    disabled={loading}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Etiquetas/Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="Separados por comas"
                  disabled={loading}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            {/* Nuevas imágenes */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '15px', color: '#333', borderBottom: '2px solid #eee', paddingBottom: '5px' }}>
                Cambiar Imágenes
              </h3>
              
              <div style={{ marginBottom: '15px' }}>
                <label className="img-label">
                  Seleccionar Nuevas Imágenes (opcional)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleImageChange}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1.8px solid #ccc',
                    borderRadius: '8px',
                    backgroundColor: '#f8f9fa'
                  }}
                />
                <small style={{ color: '#666', fontSize: '12px', display: 'block', marginTop: '5px' }}>
                  Si seleccionas nuevas imágenes, reemplazarán las actuales.
                </small>
              </div>

              {/* Preview de nuevas imágenes */}
              {newImagePreviews.length > 0 && (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', 
                  gap: '10px',
                  marginTop: '15px'
                }}>
                  {newImagePreviews.map((preview, index) => (
                    <div key={index} style={{ position: 'relative' }}>
                      <img
                        src={preview}
                        alt={`Nueva imagen ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '120px',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          border: '2px solid #28a745'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        disabled={loading}
                        style={{
                          position: 'absolute',
                          top: '5px',
                          right: '5px',
                          background: 'rgba(255, 0, 0, 0.8)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          cursor: 'pointer'
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Botones */}
            <div className="popup-actions">
              <button 
                type="button" 
                className="cancel" 
                onClick={() => setIsEditing(false)}
                disabled={loading}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="save"
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProductModal;