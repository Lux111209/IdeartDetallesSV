import React from "react";
import { NavLink } from "react-router-dom";
import "../css/Sidebar.css";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="profile">
        <img src="/icono.jpg" alt="Usuario" className="avatar" />
        <h3>Luz Gazpario</h3>
        <p>20210404@alumnos.edu.sv</p>
      </div>
      <nav className="menu">
        <NavLink to="/Dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
          Dashboard
        </NavLink>
        <NavLink to="/ProductManager" className={({ isActive }) => (isActive ? "active" : "")}>
          Productos
        </NavLink>
        <NavLink to="/Providers" className={({ isActive }) => (isActive ? "active" : "")}>
          Proveedores
        </NavLink>
        <NavLink to="/Offers" className={({ isActive }) => (isActive ? "active" : "")}>
          Ofertas
        </NavLink>
        <NavLink to="/ventas" className={({ isActive }) => (isActive ? "active" : "")}>
          Ventas
        </NavLink>
        <NavLink to="/Review" className={({ isActive }) => (isActive ? "active" : "")}>
          Reseñas
        </NavLink>
      </nav>
      <button className="logout">⏻ Salir</button>
    </aside>
  );
};

export default Sidebar;
