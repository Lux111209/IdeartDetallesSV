// src/pages/ProductManager.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar.jsx";
import ProductCard from "../components/ProductCard.jsx";
import ProductModal from "../components/ProductModal.jsx";
import AddProductModal from "../components/AddProductModal.jsx";
import "../css/ProductManager.css";

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const fakeProducts = [
      {
        _id: "1",
        name: "Camiseta Blanca",
        price: 15.99,
        stock: 20,
        productType: "Ropa",
        size: "M",
        images: ["/charli.jpg"],
      },
      {
        _id: "2",
        name: "Camisa Negra",
        price: 45.5,
        stock: 10,
        productType: "Camisas",
        size: "42",
        images: ["/maxi.jpg"],
      },
      {
        _id: "3",
        name: "Gorra Azul",
        price: 12.0,
        stock: 5,
        productType: "Accesorios",
        size: "Único",
        images: ["/gorra.jpg"],
      },
    ];
    setProducts(fakeProducts);
  }, []);

  const handleCardClick = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handleSave = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
    );
    handleCloseModal();
  };

  const handleDelete = (id) => {
    setProducts((prev) => prev.filter((p) => p._id !== id));
    handleCloseModal();
  };

  const handleAdd = (newProduct) => {
    setProducts((prev) => [...prev, newProduct]);
    setShowAddModal(false);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="product-manager-layout" style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <div className="product-manager-content" style={{ flex: 1, padding: "20px" }}>
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

        <div
          className="product-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "15px",
          }}
        >
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              onClick={() => handleCardClick(product)}
              style={{ cursor: "pointer" }}
            >
              <ProductCard product={product} />
            </div>
          ))}
          {filteredProducts.length === 0 && <p>No se encontraron productos.</p>}
        </div>
      </div>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={handleCloseModal}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}

      {showAddModal && <AddProductModal onClose={() => setShowAddModal(false)} onAdd={handleAdd} />}
    </div>
  );
};

export default ProductManager;
