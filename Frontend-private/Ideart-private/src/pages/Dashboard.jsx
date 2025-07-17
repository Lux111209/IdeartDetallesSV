import React from "react"; // Importo React para usar JSX
import Sidebar from "../components/Sidebar"; // Sidebar del dashboard, menú lateral
// Importo componentes de Recharts para crear gráficos
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend
} from "recharts";
import "../css/Dashboard.css"; // Estilos específicos del dashboard
// Datos para el gráfico de pastel (pie chart) — categorías con valores
const pastelData = [
  { name: "Electrónica", value: 400 },
  { name: "Moda", value: 300 },
  { name: "Hogar", value: 300 },
  { name: "Otros", value: 200 },
];

// Datos para gráfico de barras — ventas por tienda
const barData = [
  { tienda: "San Salvador", ventas: 340 },
  { tienda: "Santa Ana", ventas: 260 },
  { tienda: "San Miguel", ventas: 220 },
  { tienda: "La Libertad", ventas: 190 },
  { tienda: "Usulután", ventas: 170 },
];

// Datos para gráfico de líneas — gasto y ganancia en últimos 6 meses
const lineaData = [
  { mes: "Feb", gasto: 4000, ganancia: 2400 },
  { mes: "Mar", gasto: 3000, ganancia: 1398 },
  { mes: "Abr", gasto: 2000, ganancia: 9800 },
  { mes: "May", gasto: 2780, ganancia: 3908 },
  { mes: "Jun", gasto: 1890, ganancia: 4800 },
  { mes: "Jul", gasto: 2390, ganancia: 3800 },
];

// Colores que se usan en los gráficos para diferenciar categorías
const colores = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

// Componente principal del Dashboard
const Dashboard = () => {
  return (
    <div className="dashboard">
      <Sidebar /> {/* Menú lateral fijo */}

      <main className="main">
        {/* Encabezado con saludo y campana de notificaciones */}
        <div className="header">
          <h2>¡Bienvenida, Luz Gazpario!</h2>
        </div>

        {/* Resumen rápido con cards de info general */}
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

        {/* Sección con estadísticas y gráficos */}
        <div className="stats">
          <div className="box">
            <h4>Número de usuarios</h4>
            <p>👥 583K Clientes</p>
          </div>

          <div className="box">
            <h4>Valores de Inventario</h4>
            {/* Gráfico de pastel que usa datos pastelData */}
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pastelData}       // Datos
                  dataKey="value"         // Campo con valores numéricos
                  nameKey="name"          // Campo con etiquetas
                  cx="50%"                // Centro horizontal
                  cy="50%"                // Centro vertical
                  outerRadius={70}        // Radio del círculo
                  label                   // Mostrar etiquetas
                >
                  {/* Cada segmento con un color distinto */}
                  {pastelData.map((_, index) => (
                    <Cell key={index} fill={colores[index % colores.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="box">
            <h4>Top 10 Tiendas por Ventas</h4>
            {/* Gráfico de barras para ventas por tienda */}
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData}>
                <XAxis dataKey="tienda" /> {/* Eje X con nombres de tiendas */}
                <YAxis /> {/* Eje Y automático */}
                <Tooltip /> {/* Tooltip al pasar el mouse */}
                <Bar dataKey="ventas" fill="#8884d8" /> {/* Barras con valor ventas */}
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="box wide">
            <h4>Gasto vs Ganancia (últimos 6 meses)</h4>
            {/* Gráfico de líneas comparando gasto y ganancia */}
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={lineaData}>
                <CartesianGrid strokeDasharray="3 3" /> {/* Cuadrícula */}
                <XAxis dataKey="mes" /> {/* Eje X con meses */}
                <YAxis /> {/* Eje Y automático */}
                <Tooltip /> {/* Tooltip al pasar el mouse */}
                <Legend /> {/* Leyenda para las líneas */}
                <Line type="monotone" dataKey="gasto" stroke="#ff7300" /> {/* Línea gasto */}
                <Line type="monotone" dataKey="ganancia" stroke="#387908" /> {/* Línea ganancia */}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; // Exporto para usar este componente en la app
