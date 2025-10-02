import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom"; // 👈 usamos navigate
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/Sidebar.css";

const Sidebar = ({ children }) => {
  // Estado que controla si el sidebar está abierto o cerrado
  const [open, setOpen] = useState(true);

  // Estado para detectar si estamos en móvil (pantallas <600px)
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // Detectar tamaño pantalla
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

  // Toggle sidebar en móvil
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

  //  Cerrar sesión (logout)
  const handleLogout = async () => {
    try {
      // 🔹 Llamada opcional al backend para cerrar sesión y limpiar cookies
      await fetch("http://localhost:5000/api/logout", {
        method: "POST",
        credentials: "include", //  asegura borrar cookies HttpOnly en backend
      });
    } catch (err) {
      console.warn("Error al cerrar sesión en el servidor", err);
    }

    // 🔹 Borrar token y expiración del localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("expiry");

    // 🔹 Borrar cookies manualmente (si el backend no las borra)
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // 🔹 Notificar con toast
    toast.success("Sesión cerrada correctamente", {
      position: "bottom-left",
      autoClose: 2000,
      hideProgressBar: false,
      pauseOnHover: true,
      closeOnClick: true,
      draggable: true,
    });

    // 🔹 Redirigir al login tras un corto delay
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  return (
    <>
      {/* Botón toggle visible en móvil */}
      {isMobile && (
        <button className="toggle-btn" onClick={toggleSidebar} aria-label="Abrir/cerrar menú">
          ☰
        </button>
      )}

      {/* Sidebar con clases según esté abierto o cerrado */}
      <aside className={`sidebar ${open ? "open" : "closed"}`}>
        {/* Perfil */}
        <div className="profile">
          <img src="/icono.jpg" alt="Usuario" className="avatar" />
          <h3>Luz Gazpario</h3>
          <p>20210404@alumnos.edu.sv</p>
        </div>

        {/* Menú */}
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
              onClick={() => isMobile && setOpen(false)}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <button className="logout" onClick={handleLogout}>
          ⏻ Salir
        </button>
      </aside>

      {/* Contenido principal que se adapta al sidebar */}
      <main className={`main-content ${open ? "sidebar-open" : "sidebar-closed"}`}>
        {children}
      </main>
          
      <ToastContainer />
    </>
  );
};

export default Sidebar;
