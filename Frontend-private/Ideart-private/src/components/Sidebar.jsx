import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Importo estilos globales para toast
import "../css/Sidebar.css";

const Sidebar = ({ children }) => {
  // Estado que controla si el sidebar está abierto o cerrado
  const [open, setOpen] = useState(true);

  // Estado para detectar si estamos en móvil (pantallas <600px)
  const [isMobile, setIsMobile] = useState(false);

  // Detecta cambios en el tamaño de la ventana para activar modo móvil o escritorio
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setIsMobile(true);
        setOpen(false); // En móvil, sidebar inicia cerrado
      } else {
        setIsMobile(false);
        setOpen(true); // En escritorio, sidebar inicia abierto
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Llamo inmediatamente para estado inicial

    // Limpieza para evitar memory leaks
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Alternar apertura/cierre del sidebar en móvil y mostrar toast informativo
  const toggleSidebar = () => {
    setOpen(!open);
    toast.info(`Menú ${!open ? "abierto" : "cerrado"}`, {
      position: "bottom-left",
      autoClose: 1500,
      hideProgressBar: true,
      pauseOnHover: false,
      closeOnClick: true,
      draggable: true,
    });
  };

  // Maneja el logout con un toast confirmando la acción
  const handleLogout = () => {
    // Aquí se pondría la lógica real para cerrar sesión
    toast.success("Sesión cerrada correctamente", {
      position: "bottom-left",
      autoClose: 2500,
      hideProgressBar: false,
      pauseOnHover: true,
      closeOnClick: true,
      draggable: true,
    });
  };

  return (
    <>
      {/* Botón toggle para abrir/cerrar menú visible solo en móvil */}
      {isMobile && (
        <button
          className="toggle-btn"
          onClick={toggleSidebar}
          aria-label="Abrir/cerrar menú"
        >
          ☰
        </button>
      )}

      {/* Sidebar con clases según esté abierto o cerrado */}
      <aside className={`sidebar ${open ? "open" : "closed"}`}>
        {/* Sección perfil usuario */}
        <div className="profile">
          <img src="/icono.jpg" alt="Usuario" className="avatar" />
          <h3>Luz Gazpario</h3>
          <p>20210404@alumnos.edu.sv</p>
        </div>

        {/* Menú de navegación */}
        <nav className="menu">
          {[
            { to: "/Dashboard", label: "Dashboard" },
            { to: "/ProductManager", label: "Productos" },
            { to: "/Providers", label: "Proveedores" },
            { to: "/Offers", label: "Ofertas" },
            { to: "/Review", label: "Reseñas" },
            { to: "/Personalizaciones", label: "Personalizaciones" },
            { to: "/Pedidos", label: "Pedidos" },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => isMobile && setOpen(false)} // Cierra menú en móvil al seleccionar
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Botón para cerrar sesión */}
        <button className="logout" onClick={handleLogout}>
          ⏻ Salir
        </button>
      </aside>

      {/* Contenido principal que se adapta al sidebar */}
      <main className={`main-content ${open ? "sidebar-open" : "sidebar-closed"}`}>
        {children}
      </main>

      {/* Contenedor de los toasts */}
      <ToastContainer />
    </>
  );
};

export default Sidebar;
