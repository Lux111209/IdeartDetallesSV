import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "../css/Sidebar.css";

const Sidebar = ({ children }) => {
  const [open, setOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setIsMobile(true);
        setOpen(false);
      } else {
        setIsMobile(false);
        setOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {isMobile && (
        <button
          className="toggle-btn"
          onClick={() => setOpen(!open)}
          aria-label="Abrir/cerrar menú"
        >
          ☰
        </button>
      )}

      <aside className={`sidebar ${open ? "open" : "closed"}`}>
        <div className="profile">
          <img src="/icono.jpg" alt="Usuario" className="avatar" />
          <h3>Luz Gazpario</h3>
          <p>20210404@alumnos.edu.sv</p>
        </div>
        <nav className="menu">
          {[
            { to: "/Dashboard", label: "Dashboard" },
            { to: "/ProductManager", label: "Productos" },
            { to: "/Providers", label: "Proveedores" },
            { to: "/Offers", label: "Ofertas" },
            { to: "/Review", label: "Reseñas" },
            { to: "/sales", label: "Ventas" },
            { to: "/Personalizaciones", label: "Personalizaciones" },
            { to: "/Pedidos", label: "Pedidos" },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => isMobile && setOpen(false)} // cerrar sidebar en móvil al elegir link
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <button
          className="logout"
          onClick={() => alert("Cerrar sesión")}
        >
          ⏻ Salir
        </button>
      </aside>

      {/* Contenido principal que se desplaza para dejar espacio al sidebar */}
      <main className="main-content">{children}</main>
    </>
  );
};

export default Sidebar;
