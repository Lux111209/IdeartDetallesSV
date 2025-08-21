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

  // Cargar datos del producto
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

  // Manejo de inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Manejo de nuevas imágenes
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 5) return alert('Máximo 5 imágenes permitidas');

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (files.some(f => !allowedTypes.includes(f.type))) return alert('Solo JPG, PNG, JPEG permitidos');
    if (files.some(f => f.size > 5 * 1024 * 1024)) return alert('Cada imagen debe ser menor a 5MB');

    setNewImages(files);
    setNewImagePreviews(files.map(f => URL.createObjectURL(f)));
  };

  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Validación de formulario
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!formData.productType.trim()) newErrors.productType = 'El tipo de producto es obligatorio';
    if (!formData.price.trim() || isNaN(formData.price) || parseFloat(formData.price) < 0) newErrors.price = 'Precio inválido';
    if (!formData.stock.trim() || isNaN(formData.stock) || parseInt(formData.stock) < 0) newErrors.stock = 'Stock inválido';
    if (!formData.description.trim()) newErrors.description = 'La descripción es obligatoria';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const updatedProduct = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };
    if (newImages.length > 0) updatedProduct.newImages = newImages;

    try {
      await onSave(updatedProduct);
      setIsEditing(false);
    } catch (error) {
      alert('Error al guardar producto: ' + error.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Eliminar este producto?')) return;
    try {
      await onDelete(product.id || product._id);
    } catch (error) {
      alert('Error al eliminar producto: ' + error.message);
    }
  };

  const handleClose = () => {
    newImagePreviews.forEach(url => URL.revokeObjectURL(url));
    setIsEditing(false);
    onClose();
  };

  if (!product) return null;

  return (
    <div className="popup-fullscreen">
      <div className="popup-container">
        <button className="popup-close" onClick={handleClose} disabled={loading}>✕</button>
        <h2>{isEditing ? 'Editar Producto' : 'Detalles del Producto'}</h2>

        {!isEditing ? (
          <div className="view-mode">
            {product.images?.length > 0 && (
              <div className="img-preview">
                {product.images.map((img, i) => (
                  <img key={i} src={img} alt={`${product.name} ${i + 1}`} />
                ))}
              </div>
            )}

            <div className="info-grid">
              <div className="info-box">
                <h3>Básica</h3>
                <p><strong>Nombre:</strong> {product.name}</p>
                <p><strong>Tipo:</strong> {product.productType}</p>
                <p><strong>Precio:</strong> ${parseFloat(product.price).toFixed(2)}</p>
                <p><strong>Stock:</strong> {product.stock}</p>
                <p><strong>Estado:</strong> <span className={product.stock > 0 ? 'stock-available' : 'stock-empty'}>{product.stock > 0 ? 'Disponible' : 'Sin Stock'}</span></p>
              </div>

              <div className="info-box">
                <h3>Detalles</h3>
                {product.subType && <p><strong>Subtipo:</strong> {product.subType}</p>}
                {product.color && <p><strong>Color:</strong> {product.color}</p>}
                {product.size && <p><strong>Talla:</strong> {product.size}</p>}
                {product.material && <p><strong>Material:</strong> {product.material}</p>}
                {product.usageCategory && <p><strong>Categoría:</strong> {product.usageCategory}</p>}
              </div>
            </div>

            {product.description && (
              <div className="description-box">
                <h3>Descripción</h3>
                <p>{product.description}</p>
              </div>
            )}

            {product.tags?.length > 0 && (
              <div className="tags-box">
                {product.tags.map((tag, i) => (
                  <span key={i} className="tag">{tag}</span>
                ))}
              </div>
            )}

            <div className="popup-actions">
              <button className="btn-delete" onClick={handleDelete} disabled={loading}>{loading ? 'Eliminando...' : 'Eliminar'}</button>
              <button className="btn-edit" onClick={() => setIsEditing(true)} disabled={loading}>Editar</button>
            </div>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="edit-mode">
            {/* Información básica */}
            <div className="section">
              <h3>Básica *</h3>
              <div className="input-grid">
                <div>
                  <label>Nombre</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} disabled={loading} className={errors.name ? 'input-error' : ''} />
                  {errors.name && <span className="error">{errors.name}</span>}
                </div>

                <div>
                  <label>Tipo</label>
                  <select name="productType" value={formData.productType} onChange={handleInputChange} disabled={loading} className={errors.productType ? 'input-error' : ''}>
                    <option value="">Seleccionar...</option>
                    {productTypes.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                  {errors.productType && <span className="error">{errors.productType}</span>}
                </div>

                <div>
                  <label>Precio ($)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleInputChange} min="0" step="0.01" disabled={loading} className={errors.price ? 'input-error' : ''} />
                  {errors.price && <span className="error">{errors.price}</span>}
                </div>

                <div>
                  <label>Stock</label>
                  <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} min="0" disabled={loading} className={errors.stock ? 'input-error' : ''} />
                  {errors.stock && <span className="error">{errors.stock}</span>}
                </div>
              </div>

              <label>Descripción</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} disabled={loading} className={errors.description ? 'input-error' : ''} />
              {errors.description && <span className="error">{errors.description}</span>}
            </div>

            {/* Detalles adicionales */}
            <div className="section">
              <h3>Detalles</h3>
              <div className="input-grid">
                <input type="text" name="subType" placeholder="Subtipo" value={formData.subType} onChange={handleInputChange} disabled={loading} />
                <input type="text" name="color" placeholder="Color" value={formData.color} onChange={handleInputChange} disabled={loading} />
                <input type="text" name="size" placeholder="Talla/Tamaño" value={formData.size} onChange={handleInputChange} disabled={loading} />
                <input type="text" name="material" placeholder="Material" value={formData.material} onChange={handleInputChange} disabled={loading} />
                <input type="text" name="usageCategory" placeholder="Categoría de uso" value={formData.usageCategory} onChange={handleInputChange} disabled={loading} />
              </div>

              <label>Etiquetas (separadas por comas)</label>
              <input type="text" name="tags" value={formData.tags} onChange={handleInputChange} disabled={loading} />
            </div>

            {/* Imágenes */}
            <div className="section">
              <h3>Cambiar Imágenes</h3>
              <input type="file" multiple accept="image/jpeg,image/png,image/jpg" onChange={handleImageChange} disabled={loading} />
              {newImagePreviews.length > 0 && (
                <div className="img-preview">
                  {newImagePreviews.map((img, i) => (
                    <div key={i} className="img-wrapper">
                      <img src={img} alt={`Nueva ${i + 1}`} />
                      <button type="button" onClick={() => removeNewImage(i)} disabled={loading}>✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="popup-actions">
              <button type="button" className="btn-delete" onClick={() => setIsEditing(false)} disabled={loading}>Cancelar</button>
              <button type="submit" className="btn-edit" disabled={loading}>{loading ? 'Guardando...' : 'Guardar Cambios'}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProductModal;
