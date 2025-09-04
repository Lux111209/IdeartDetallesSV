import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import '../css/ProductModal.css';

const ProductModal = ({ product, onClose, onSave, onDelete, loading = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);

  // === React Hook Form ===
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
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
    }
  });

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

  // Cargar datos del producto en el formulario
  useEffect(() => {
    if (product) {
      reset({
        name: product.name || '',
        productType: product.productType || '',
        subType: product.subType || '',
        usageCategory: product.usageCategory || '',
        color: product.color || '',
        size: product.size || '',
        description: product.description || '',
        stock: product.stock ?? 0,
        price: product.price ?? 0,
        material: product.material || '',
        tags: Array.isArray(product.tags) ? product.tags.join(', ') : (product.tags || '')
      });
    }
  }, [product, reset]);

  // Manejo de nuevas imágenes
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 5) {
      alert('Máximo 5 imágenes permitidas');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (files.some(f => !allowedTypes.includes(f.type))) {
      alert('Solo JPG, PNG, JPEG permitidos');
      return;
    }
    if (files.some(f => f.size > 5 * 1024 * 1024)) {
      alert('Cada imagen debe ser menor a 5MB');
      return;
    }

    setNewImages(files);
    setNewImagePreviews(files.map(f => URL.createObjectURL(f)));
  };

  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Guardar (con RHF)
  const onSubmit = async (data) => {
    const updatedProduct = {
      ...data,
      price: parseFloat(data.price),
      stock: parseInt(data.stock, 10),
      tags: (data.tags || '')
        .split(',')
        .map(t => t.trim())
        .filter(Boolean)
    };

    if (newImages.length > 0) {
      updatedProduct.newImages = newImages;
    }

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
        <button className="popup-close" onClick={handleClose} disabled={loading} aria-label="Cerrar">✕</button>
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
                <p><strong>Precio:</strong> ${parseFloat(product.price ?? 0).toFixed(2)}</p>
                <p><strong>Stock:</strong> {product.stock}</p>
                <p>
                  <strong>Estado:</strong>{' '}
                  <span className={product.stock > 0 ? 'stock-available' : 'stock-empty'}>
                    {product.stock > 0 ? 'Disponible' : 'Sin Stock'}
                  </span>
                </p>
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
              <button className="btn-delete" onClick={handleDelete} disabled={loading}>
                {loading ? 'Eliminando...' : 'Eliminar'}
              </button>
              <button className="btn-edit" onClick={() => setIsEditing(true)} disabled={loading}>
                Editar
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="edit-mode" noValidate>
            {/* Información básica */}
            <div className="section">
              <h3>Básica *</h3>
              <div className="input-grid">
                <div>
                  <label htmlFor="name">Nombre</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Nombre del producto"
                    disabled={loading}
                    className={errors.name ? 'input-error' : ''}
                    {...register('name', {
                      required: 'El nombre es obligatorio',
                      minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                    })}
                  />
                  {errors.name && <span className="error">{errors.name.message}</span>}
                </div>

                <div>
                  <label htmlFor="productType">Tipo</label>
                  <select
                    id="productType"
                    disabled={loading}
                    className={errors.productType ? 'input-error' : ''}
                    {...register('productType', { required: 'El tipo de producto es obligatorio' })}
                  >
                    <option value="">Seleccionar...</option>
                    {productTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.productType && <span className="error">{errors.productType.message}</span>}
                </div>

                <div>
                  <label htmlFor="price">Precio ($)</label>
                  <input
                    id="price"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    disabled={loading}
                    className={errors.price ? 'input-error' : ''}
                    {...register('price', {
                      required: 'Precio obligatorio',
                      valueAsNumber: true,
                      min: { value: 0, message: 'Debe ser 0 o mayor' }
                    })}
                  />
                  {errors.price && <span className="error">{errors.price.message}</span>}
                </div>

                <div>
                  <label htmlFor="stock">Stock</label>
                  <input
                    id="stock"
                    type="number"
                    inputMode="numeric"
                    min="0"
                    placeholder="0"
                    disabled={loading}
                    className={errors.stock ? 'input-error' : ''}
                    {...register('stock', {
                      required: 'Stock obligatorio',
                      valueAsNumber: true,
                      min: { value: 0, message: 'Debe ser 0 o mayor' }
                    })}
                  />
                  {errors.stock && <span className="error">{errors.stock.message}</span>}
                </div>
              </div>

              <label htmlFor="description">Descripción</label>
              <textarea
                id="description"
                rows={3}
                placeholder="Describe el producto..."
                disabled={loading}
                className={errors.description ? 'input-error' : ''}
                {...register('description', {
                  required: 'La descripción es obligatoria',
                  minLength: { value: 5, message: 'Mínimo 5 caracteres' }
                })}
              />
              {errors.description && <span className="error">{errors.description.message}</span>}
            </div>

            {/* Detalles adicionales */}
            <div className="section">
              <h3>Detalles</h3>
              <div className="input-grid">
                <input type="text" placeholder="Subtipo" disabled={loading} {...register('subType')} />
                <input type="text" placeholder="Color" disabled={loading} {...register('color')} />
                <input type="text" placeholder="Talla/Tamaño" disabled={loading} {...register('size')} />
                <input type="text" placeholder="Material" disabled={loading} {...register('material')} />
                <input type="text" placeholder="Categoría de uso" disabled={loading} {...register('usageCategory')} />
              </div>

              <label htmlFor="tags">Etiquetas (separadas por comas)</label>
              <input id="tags" type="text" placeholder="ej: verano, oferta, nuevo" disabled={loading} {...register('tags')} />
            </div>

            {/* Imágenes */}
            <div className="section">
              <h3>Cambiar Imágenes</h3>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleImageChange}
                disabled={loading}
              />
              {newImagePreviews.length > 0 && (
                <div className="img-preview">
                  {newImagePreviews.map((img, i) => (
                    <div key={i} className="img-wrapper">
                      <img src={img} alt={`Nueva ${i + 1}`} />
                      <button type="button" onClick={() => removeNewImage(i)} disabled={loading} aria-label="Eliminar imagen">✕</button>
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
