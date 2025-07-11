import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ProductManager from "./pages/ProductManager";
import Providers from "./pages/Providers";
import Offers from "./pages/Offers";
import Sales from "./pages/Sales";



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

      </Routes>
    </Router>
  )
}
export default App;