import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Dashboard from "./pages/Dashboard";
import ProductManager from "./pages/ProductManager";
import Providers from "./pages/Providers";
import Offers from "./pages/Offers";
import Sales from "./pages/Sales";
import Review from "./pages/Review"; 
import Personalizaciones from "./pages/Personalizaciones"; // Importa el componente Personalizaciones
import Pedidos from "./pages/Pedidos.jsx"; // Importa el componente Pedidos

// Importa los componentes necesarios

function App() {
  
  return (
    <Router>
 
      <Routes>
        <Route path="/" element={<Dashboard />} /> {/* Ruta agregada */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/productmanager" element={<ProductManager />} />
        <Route path="/providers" element={<Providers />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/review" element={<Review />} />
        <Route path="/personalizaciones" element={<Personalizaciones />} /> {/* Ruta para Personalizaciones */}
        <Route path="/pedidos" element={<Pedidos />} /> {/* Ruta para Pedidos */}
      </Routes>
    </Router>
  )
}
export default App;