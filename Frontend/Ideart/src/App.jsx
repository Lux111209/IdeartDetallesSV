import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./css/AuthForm.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Product from "./pages/Product";
import Category from "./pages/Category";
import ContactUs from "./pages/ContactUs";
import TermsAndConditions from "./pages/TermsAndConditions"; 
import Reviews from "./pages/Reviews";


//import Profile from "./pages/Profile";
//import ShoppingCart from "./pages/ShoppingCart";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Product />} />
        <Route path="/category" element={<Category />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/terminos" element={<TermsAndConditions />} /> 
        <Route path="/reviews" element={<Reviews />} />
      </Routes>
    </Router>
  );
}

export default App;
