import React from "react";

const Filtros = ({ category, setCategory, minPrice, setMinPrice, maxPrice, setMaxPrice, color, setColor }) => {
  return (
    <div className="filters-panel">
      <div className="filters-header">
        <h3>Filtros</h3>
        <button className="clear-btn" onClick={() => {
          setCategory('');
          setMinPrice(0);
          setMaxPrice(5000);
          setColor('');
        }}>
          Limpiar
        </button>
      </div>

      <div className="filters-select">
        <label>Productos</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Todos</option>
          <option value="Accesorios">Accesorios</option>
          <option value="Juegos">Juegos</option>
          <option value="tazas">Tazas</option>
          <option value="camisas">Camisas</option>
        </select>
      </div>

      <div className="filters-price">
        <label>Precio</label>
        <div className="price-controls">
          <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
          <input type="range" min="0" max="5000" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
          <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
        </div>
      </div>

      <div className="filters-colors">
        <label>Colores</label>
        <div className="color-options">
          {["#fff", "#000", "#ff0", "#f00", "#0f0", "#00f", "#f0f", "#ff69b4", "#800080", "#999"].map(c => (
            <div
              key={c}
              onClick={() => setColor(c)}
              style={{ backgroundColor: c }}
              className="color-circle"
            />
          ))}
        </div>
      </div>

      <div className="filters-extra">
        <label>Tallas</label>
        <div className="placeholder-box">[Espacio para tallas]</div>

        <label>Descuentos</label>
        <select>
          <option value="">Seleccionar</option>
          <option value="10">10%</option>
          <option value="20">20%</option>
          <option value="50">50%</option>
        </select>
      </div>
    </div>
  );
};

export default Filtros;
