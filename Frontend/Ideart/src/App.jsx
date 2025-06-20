import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./css/AuthForm.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Product from "./pages/Product";
import Category from "./pages/Category";
//import ContactUs from "./pages/ContactUs";
//import Profile from "./pages/Profile";
//import ShoppingCart from "./pages/ShoppingCart";
//import Reviews from "./pages/Reviews";


function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Product />} />
        <Route path="/category" element={<Category />} />
        {/*<Route path="/contactus" element={<ContactUs />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/shoppingcart" element={<ShoppingCart />} />
        <Route path="/reviews" element={<Reviews />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  )
}

export default App;
