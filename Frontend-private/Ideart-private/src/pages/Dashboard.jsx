// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import {
  PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import axios from "axios";
import "../css/Dashboard.css";

const colores = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get("https://ideartdetallessv-1.onrender.com/api/dashboard") // Endpoint único
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!stats) return <div>Cargando estadísticas...</div>;

  // Datos para gráficos
  const pastelData = [
    { name: "Stock disponible", value: stats.stock },
    { name: "Sin Stock", value: stats.productosSinStock },
  ];

  const reseñasProductoPromedio = stats.promedioResenasProducto.reduce(
    (acc, cur) => acc + cur.promedio, 0
  ) / (stats.promedioResenasProducto.length || 1);

  const reseñasGeneralPromedio = stats.promedioResenasGeneral.reduce(
    (acc, cur) => acc + cur.promedio, 0
  ) / (stats.promedioResenasGeneral.length || 1);

  const reseñasData = [
    { name: "Reseñas Producto", value: reseñasProductoPromedio },
    { name: "Reseñas General", value: reseñasGeneralPromedio },
  ];

  const lineaData = stats.ventasMes.map(v => ({
    mes: ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"][v._id - 1],
    totalVentas: v.totalVentas,
    totalDinero: v.totalDinero
  }));

  return (
    <div className="dashboard">
      <Sidebar />

      <main className="main">
        <div className="header">
          <h2>¡Bienvenida, Luz Gazpario!</h2>
        </div>

        {/* Cards de resumen */}
        <div className="overview">
          <div className="card">🛒<p>Total Productos</p><strong>{stats.totalProductos}</strong></div>
          <div className="card">📦<p>Stock Total</p><strong>{stats.stock}</strong></div>
          <div className="card">❌<p>Sin Stock</p><strong>{stats.productosSinStock}</strong></div>
          <div className="card">👥<p>Total Usuarios</p><strong>{stats.totalUsuarios}</strong></div>
        </div>

        {/* Gráficos */}
        <div className="stats">
          <div className="box">
            <h4>Valores de Inventario</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pastelData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                  {pastelData.map((_, index) => (
                    <Cell key={index} fill={colores[index % colores.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="box">
            <h4>Promedio de Reseñas</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={reseñasData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                  {reseñasData.map((_, index) => (
                    <Cell key={index} fill={colores[index % colores.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="box wide">
            <h4>Ventas últimos 6 meses</h4>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={lineaData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="totalVentas" stroke="#ff7300" name="Ventas" />
                <Line type="monotone" dataKey="totalDinero" stroke="#387908" name="Ingresos" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
