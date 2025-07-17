// src/routes/PublicRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

// Componente de rutas públicas
const PublicRoute = () => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/home" replace /> : <Outlet />;
};

export default PublicRoute;
