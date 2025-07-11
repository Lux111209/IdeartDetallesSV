import React from "react";
import Sidebar from "../components/Sidebar";
import "../css/Dashboard.css"; // Asegúrate de tener este archivo CSS

const Dashboard = () => {
  return (
    <div className="dashboard">
      <Sidebar />
      <main className="main">
        <div className="header">
          <h2>¡Bienvenida, Luz Gazpario!</h2>
          <div className="bell">🔔</div>
        </div>

        <div className="overview">
          <div className="card">
            🛒
            <p>Total Productos</p>
            <strong>5483</strong>
          </div>
          <div className="card">
            📦
            <p>Órdenes</p>
            <strong>2859</strong>
          </div>
          <div className="card">
            📦
            <p>Total Stock</p>
            <strong>5483</strong>
          </div>
          <div className="card">
            ❌
            <p>Sin Stock</p>
            <strong>38</strong>
          </div>
        </div>

        <div className="stats">
          <div className="box">
            <h4>Número de usuarios</h4>
            <p>👥 583K Clientes</p>
          </div>

          <div className="box">
            <h4>Valores de Inventario</h4>
            {/* Aquí va la imagen del gráfico circular */}
            <img src="/grafico-pastel.png" alt="Gráfico circular" />
          </div>

          <div className="box">
            <h4>Top 10 Tiendas por Ventas</h4>
            {/* Aquí va la imagen del gráfico de barras */}
            <img src="/grafico-barras.png" alt="Gráfico barras" />
          </div>

          <div className="box wide">
            <h4>Gasto vs Ganancia (últimos 6 meses)</h4>
            {/* Aquí va la imagen del gráfico de línea */}
            <img src="/grafico-linea.png" alt="Gráfico línea" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
