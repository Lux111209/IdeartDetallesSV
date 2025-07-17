import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar.jsx"; // Menú lateral fijo
import ProductCard from "../components/ProductCard.jsx"; // Tarjeta para mostrar producto
import ProductModal from "../components/ProductModal.jsx"; // Modal para editar producto
import AddProductModal from "../components/AddProductModal.jsx"; // Modal para agregar producto
import "../css/ProductManager.css";
import { toast } from "react-toastify"; // Notificaciones
import "react-toastify/dist/ReactToastify.css";

const ProductManager = () => {
  // Estado con lista de productos
  const [products, setProducts] = useState([]);
  // Estado para buscar productos por nombre
  const [search, setSearch] = useState("");
  // Producto seleccionado para editar
  const [selectedProduct, setSelectedProduct] = useState(null);
  // Controla si mostrar modal para agregar producto
  const [showAddModal, setShowAddModal] = useState(false);

  // Simula carga inicial de productos (podría ser fetch real)
  useEffect(() => {
    const fakeProducts = [
      {
        _id: "1",
        name: "Camiseta Blanca",
        price: 15.99,
        stock: 20,
        productType: "Ropa",
        size: "M",
        color: "#fff",
        images: ["/charli.jpg"],
      },
      {
        _id: "2",
        name: "Camisa Negra",
        price: 45.5,
        stock: 10,
        productType: "Camisas",
        size: "42",
        color: "#000",
        images: ["/maxi.jpg"],
      },
      {
        _id: "3",
        name: "Gorra Azul",
        price: 12.0,
        stock: 5,
        productType: "Accesorios",
        size: "Único",
        color: "#00f",
        images: ["/gorra.jpg"],
      },
    ];
    setProducts(fakeProducts);
  }, []);

  // Al hacer click en una tarjeta, selecciona el producto para editar
  const handleCardClick = (product) => {
    setSelectedProduct(product);
  };

  // Cierra el modal de edición
  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  // Guarda cambios al editar un producto y actualiza la lista
  const handleSave = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
    );
    handleCloseModal();
    toast.success("Producto actualizado exitosamente!");
  };

  // Elimina un producto de la lista
  const handleDelete = (id) => {
    setProducts((prev) => prev.filter((p) => p._id !== id));
    handleCloseModal();
    toast.info("Producto eliminado");
  };

  // Agrega un nuevo producto a la lista
  const handleAdd = (newProduct) => {
    setProducts((prev) => [...prev, newProduct]);
    setShowAddModal(false);
    toast.success("Producto agregado con éxito!");
  };

  // Filtra productos según búsqueda (nombre)
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="product-manager-layout"
      style={{ display: "flex", minHeight: "100vh" }}
    >
      <Sidebar /> {/* Sidebar fijo */}

      <div className="product-manager-content" style={{ flex: 1, padding: "20px" }}>
        {/* Barra superior con título, botón agregar y búsqueda */}
        <div
          className="top-bar"
          style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}
        >
          <h1>Gestor de Productos</h1>
          <button className="add-btn" onClick={() => setShowAddModal(true)}>
            + Agregar producto
          </button>
          <input
            className="search-input"
            type="text"
            placeholder="Buscar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Grid con tarjetas de productos */}
        <div
          className="product-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "15px",
          }}
        >
          {filteredProducts.length ? (
            filteredProducts.map((product) => (
              <div
                key={product._id}
                onClick={() => handleCardClick(product)}
                style={{ cursor: "pointer" }}
              >
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <p>No se encontraron productos.</p>
          )}
        </div>
      </div>

      {/* Modal para editar producto seleccionado */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={handleCloseModal}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}

      {/* Modal para agregar nuevo producto */}
      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAdd}
        />
      )}
    </div>
  );
};

export default ProductManager;
