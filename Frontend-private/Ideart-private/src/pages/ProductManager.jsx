import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar.jsx";
import ProductCard from "../components/ProductCard.jsx";
import ProductModal from "../components/ProductModal.jsx";
import AddProductModal from "../components/AddProductModal.jsx";
import "../css/ProductManager.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// URL base para las peticiones a la API
const API_BASE_URL = "http://localhost:5000/api";

// Objeto con todas las funciones para interactuar con la API de productos
const productsAPI = {
  // Obtener todos los productos desde el servidor
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Error al obtener productos');
      }
    } catch (error) {
      console.error('Error en getAll:', error);
      throw error;
    }
  },

  // Obtener un producto específico por su ID
  getById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Error al obtener producto');
      }
    } catch (error) {
      console.error('Error en getById:', error);
      throw error;
    }
  },

  // Crear un nuevo producto en el servidor
  create: async (productData) => {
    try {
      // Crear FormData para manejar archivos de imagen
      const formData = new FormData();
      
      // Agregar todos los campos del producto excepto las imágenes
      Object.keys(productData).forEach(key => {
        if (key !== 'images') {
          formData.append(key, productData[key]);
        }
      });
      
      // Agregar las imágenes como archivos separados
      if (productData.images && productData.images.length > 0) {
        productData.images.forEach(image => {
          formData.append('images', image);
        });
      }

      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      
      const data = await response.json();
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Error al crear producto');
      }
    } catch (error) {
      console.error('Error en create:', error);
      throw error;
    }
  },

  // Actualizar un producto existente
  update: async (id, productData) => {
    try {
      // Crear FormData para manejar archivos de imagen
      const formData = new FormData();
      
      // Agregar todos los campos del producto excepto las imágenes
      Object.keys(productData).forEach(key => {
        if (key !== 'images') {
          formData.append(key, productData[key]);
        }
      });
      
      // Agregar solo las nuevas imágenes que son archivos
      if (productData.images && productData.images.length > 0) {
        productData.images.forEach(image => {
          if (image instanceof File) {
            formData.append('images', image);
          }
        });
      }

      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData
      });
      
      const data = await response.json();
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Error al actualizar producto');
      }
    } catch (error) {
      console.error('Error en update:', error);
      throw error;
    }
  },

  // Eliminar un producto del servidor
  delete: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      const data = await response.json();
      if (data.success) {
        return true;
      } else {
        throw new Error(data.message || 'Error al eliminar producto');
      }
    } catch (error) {
      console.error('Error en delete:', error);
      throw error;
    }
  }
};

const ProductManager = () => {
  // Estados principales del componente
  const [products, setProducts] = useState([]); // Lista de todos los productos
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Mensajes de error
  const [search, setSearch] = useState(""); // Término de búsqueda
  const [selectedProduct, setSelectedProduct] = useState(null); // Producto seleccionado para ver/editar
  const [showAddModal, setShowAddModal] = useState(false); // Mostrar modal de agregar producto

  // Cargar productos cuando el componente se monta
  useEffect(() => {
    loadProducts();
  }, []);

  // Función para obtener todos los productos desde la API
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const productsData = await productsAPI.getAll();
      setProducts(productsData);
    } catch (error) {
      setError('Error al cargar productos: ' + error.message);
      console.error('Error:', error);
      toast.error('Error al cargar productos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Manejar click en una tarjeta de producto para abrir el modal de detalles
  const handleCardClick = (product) => {
    setSelectedProduct(product);
  };

  // Cerrar el modal de detalles del producto
  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  // Guardar cambios en un producto existente
  const handleSave = async (updatedProduct) => {
    try {
      setLoading(true);
      
      // Preparar los datos para la actualización
      const updateData = {
        name: updatedProduct.name,
        productType: updatedProduct.productType || updatedProduct.category,
        price: parseFloat(updatedProduct.price),
        stock: parseInt(updatedProduct.stock),
        description: updatedProduct.description || '',
        size: updatedProduct.size || '',
        color: updatedProduct.color || '',
        material: updatedProduct.material || '',
        tags: updatedProduct.tags || []
      };

      // Agregar nuevas imágenes si las hay
      if (updatedProduct.newImages && updatedProduct.newImages.length > 0) {
        updateData.images = updatedProduct.newImages;
      }

      const result = await productsAPI.update(selectedProduct._id, updateData);
      
      // Actualizar la lista local con los datos actualizados
      setProducts(prevProducts =>
        prevProducts.map(p => p._id === result._id ? result : p)
      );
      
      handleCloseModal();
      toast.success("Producto actualizado exitosamente!");
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error("Error al actualizar producto: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar un producto
  const handleDelete = async (id) => {
    // Confirmar antes de eliminar
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      return;
    }

    try {
      setLoading(true);
      await productsAPI.delete(id);
      
      // Remover el producto de la lista local
      setProducts(prevProducts => prevProducts.filter(p => p._id !== id));
      
      handleCloseModal();
      toast.info("Producto eliminado exitosamente");
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error("Error al eliminar producto: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Agregar un nuevo producto
  const handleAdd = async (newProductData) => {
    try {
      setLoading(true);
      
      // Preparar los datos para la creación
      const createData = {
        name: newProductData.name,
        productType: newProductData.productType || newProductData.category || 'General',
        price: parseFloat(newProductData.price),
        stock: parseInt(newProductData.stock || 0),
        description: newProductData.description || '',
        size: newProductData.size || '',
        color: newProductData.color || '',
        material: newProductData.material || '',
        tags: newProductData.tags || []
      };

      // Agregar imágenes si las hay
      if (newProductData.images && newProductData.images.length > 0) {
        createData.images = newProductData.images;
      }

      const result = await productsAPI.create(createData);
      
      // Agregar el nuevo producto a la lista local
      setProducts(prevProducts => [...prevProducts, result]);
      
      setShowAddModal(false);
      toast.success("Producto agregado con éxito!");
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error("Error al crear producto: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar productos según el término de búsqueda
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.productType?.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase())
  );

  // Mostrar pantalla de carga inicial
  if (loading && products.length === 0) {
    return (
      <div className="product-manager-layout" style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar />
        <div className="product-manager-content" style={{ flex: 1, padding: "20px" }}>
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <div className="loading-spinner"></div>
            <p>Cargando productos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-manager-layout" style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <div className="product-manager-content" style={{ flex: 1, padding: "20px" }}>
        
        {/* Mostrar mensajes de error si existen */}
        {error && (
          <div style={{ 
            background: '#fee', 
            color: '#c33', 
            padding: '10px', 
            borderRadius: '5px', 
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

        {/* Barra superior con título, botón de agregar y búsqueda */}
        <div className="top-bar" style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "20px",
          gap: "15px"
        }}>
          <h1>Gestor de Productos</h1>
          
          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            {/* Botón para agregar nuevo producto */}
            <button 
              className="add-btn" 
              onClick={() => setShowAddModal(true)}
              disabled={loading}
            >
              {loading ? "Cargando..." : "+ Agregar producto"}
            </button>
            
            {/* Campo de búsqueda */}
            <input
              className="search-input"
              type="text"
              placeholder="Buscar productos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ minWidth: "200px" }}
            />
          </div>
        </div>

        {/* Panel de estadísticas del inventario */}
        <div style={{ 
          display: "flex", 
          gap: "20px", 
          marginBottom: "20px",
          background: "#f8f9fa",
          padding: "15px",
          borderRadius: "8px"
        }}>
          {/* Total de productos */}
          <div style={{ textAlign: "center" }}>
            <h3 style={{ margin: "0", color: "#6c757d", fontSize: "14px" }}>Total Productos</h3>
            <p style={{ margin: "5px 0 0 0", fontSize: "24px", fontWeight: "bold", color: "#007bff" }}>
              {products.length}
            </p>
          </div>
          {/* Productos mostrados (después del filtro) */}
          <div style={{ textAlign: "center" }}>
            <h3 style={{ margin: "0", color: "#6c757d", fontSize: "14px" }}>Mostrando</h3>
            <p style={{ margin: "5px 0 0 0", fontSize: "24px", fontWeight: "bold", color: "#28a745" }}>
              {filteredProducts.length}
            </p>
          </div>
          {/* Productos sin stock */}
          <div style={{ textAlign: "center" }}>
            <h3 style={{ margin: "0", color: "#6c757d", fontSize: "14px" }}>Sin Stock</h3>
            <p style={{ margin: "5px 0 0 0", fontSize: "24px", fontWeight: "bold", color: "#dc3545" }}>
              {products.filter(p => p.stock === 0).length}
            </p>
          </div>
          {/* Productos con stock bajo */}
          <div style={{ textAlign: "center" }}>
            <h3 style={{ margin: "0", color: "#6c757d", fontSize: "14px" }}>Stock Bajo (&lt;5)</h3>
            <p style={{ margin: "5px 0 0 0", fontSize: "24px", fontWeight: "bold", color: "#ffc107" }}>
              {products.filter(p => p.stock > 0 && p.stock < 5).length}
            </p>
          </div>
        </div>

        {/* Grid de productos */}
        <div
          className="product-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "15px",
          }}
        >
          {filteredProducts.length ? (
            // Mostrar las tarjetas de productos filtrados
            filteredProducts.map((product) => (
              <div
                key={product._id}
                onClick={() => handleCardClick(product)}
                style={{ cursor: "pointer" }}
              >
                <ProductCard product={{
                  ...product,
                  // Asegurar compatibilidad con el componente ProductCard
                  id: product._id,
                  images: product.images || [],
                  price: product.price || 0,
                  stock: product.stock || 0,
                  productType: product.productType || 'General'
                }} />
              </div>
            ))
          ) : (
            // Mensaje cuando no hay productos para mostrar
            <div style={{ 
              gridColumn: "1 / -1", 
              textAlign: "center", 
              padding: "40px",
              background: "white",
              borderRadius: "8px",
              border: "2px dashed #dee2e6"
            }}>
              {search ? (
                // Mensaje cuando la búsqueda no encuentra resultados
                <>
                  <h3>No se encontraron productos</h3>
                  <p>No hay productos que coincidan con "{search}"</p>
                  <button 
                    onClick={() => setSearch("")}
                    style={{
                      padding: "8px 16px",
                      background: "#007bff",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    Limpiar búsqueda
                  </button>
                </>
              ) : (
                // Mensaje cuando no hay productos en absoluto
                <>
                  <h3>No hay productos disponibles</h3>
                  <p>Comienza agregando tu primer producto</p>
                  <button 
                    onClick={() => setShowAddModal(true)}
                    style={{
                      padding: "10px 20px",
                      background: "#2b703bff",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    + Agregar Producto
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Indicador de carga para operaciones en progreso */}
        {loading && products.length > 0 && (
          <div style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            background: "rgba(0,0,0,0.8)",
            color: "white",
            padding: "10px 20px",
            borderRadius: "4px",
            zIndex: 1000
          }}>
            Procesando...
          </div>
        )}
      </div>

      {/* Modal para ver y editar detalles del producto seleccionado */}
      {selectedProduct && (
        <ProductModal
          product={{
            ...selectedProduct,
            // Asegurar compatibilidad con el modal
            id: selectedProduct._id
          }}
          onClose={handleCloseModal}
          onSave={handleSave}
          onDelete={() => handleDelete(selectedProduct._id)}
          loading={loading}
        />
      )}

      {/* Modal para agregar un nuevo producto */}
      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAdd}
          loading={loading}
        />
      )}

      {/* Estilos CSS en línea */}
      <style jsx>{`
        .loading-spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 2s linear infinite;
          margin: 0 auto 20px auto;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .add-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .search-input:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }

        @media (max-width: 768px) {
          .top-bar {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 15px !important;
          }
          
          .top-bar > div {
            flex-direction: column !important;
            gap: 10px !important;
          }
          
          .search-input {
            min-width: auto !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductManager;