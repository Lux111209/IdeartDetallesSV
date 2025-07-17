import { Navigate, Outlet } from "react-router-dom";

// Componente de rutas protegidas
const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
