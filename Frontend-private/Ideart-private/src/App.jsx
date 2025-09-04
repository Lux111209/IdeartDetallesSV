// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Dashboard from "./pages/Dashboard";
import ProductManager from "./pages/ProductManager";
import Providers from "./pages/Providers";
import Offers from "./pages/Offers";
import Sales from "./pages/Sales";
import Review from "./pages/Review"; 
import Personalizaciones from "./pages/Personalizaciones";
import Pedidos from "./pages/Pedidos.jsx";
import LoginPriv from "./pages/LoginPriv.jsx";

// 🔒 Función para verificar autenticación
const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  const expiry = localStorage.getItem("expiry");

  if (!token || !expiry) return false;

  // Validar si ya expiró
  const now = new Date().getTime();
  if (now > parseInt(expiry)) {
    localStorage.removeItem("token");
    localStorage.removeItem("expiry");
    return false;
  }

  return true;
};

// 🔒 Componente para proteger rutas
const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" replace />;
};

function App() {
  
  return (
    <Router>
      <ToastContainer />
      <Routes>
        {/* 🔑 Login siempre accesible */}
        <Route path="/login" element={<LoginPriv />} />

        {/* 🔒 Rutas protegidas */}
        <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/productmanager" element={<ProtectedRoute element={<ProductManager />} />} />
        <Route path="/providers" element={<ProtectedRoute element={<Providers />} />} />
        <Route path="/offers" element={<ProtectedRoute element={<Offers />} />} />
        <Route path="/sales" element={<ProtectedRoute element={<Sales />} />} />
        <Route path="/review" element={<ProtectedRoute element={<Review />} />} />
        <Route path="/personalizaciones" element={<ProtectedRoute element={<Personalizaciones />} />} />
        <Route path="/pedidos" element={<ProtectedRoute element={<Pedidos />} />} />

        {/* Si no encuentra ruta => manda al login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
