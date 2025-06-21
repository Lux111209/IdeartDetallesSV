import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ProductManager from "./pages/ProductManager";
import Providers from "./pages/Providers";
import Offers from "./pages/Offers";

function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/productmanager" element={<ProductManager />} />
        <Route path="/providers" element={<Providers />} />
        <Route path="/offers" element={<Offers />} />

      </Routes>
    </Router>
  )
}
export default App;
