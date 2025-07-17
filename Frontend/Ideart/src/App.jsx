import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoutes";
import PublicRoute from "./routes/PublicRoutes";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Product from "./pages/Product";
import Category from "./pages/Category";
import ContactUs from "./pages/ContactUs";
import TermsAndConditions from "./pages/TermsAndConditions";
import Reviews from "./pages/Reviews";
import ProductDetail from "./pages/ProductDetail";
import ShoppingCart from "./pages/ShoppingCart";
import CheckoutInfo from "./pages/Checkout";
import CreditForm from "./pages/CreditForm";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import RecoverPassword from "./pages/RecoverPassword";
import CheckNumber from "./pages/CheckNumber";
import NewPassword from "./pages/NewPassword";


function App() {
  return (
    <Routes>
      {/* Primera vez: Register como página de inicio */}
      <Route path="/" element={<Register />} />

      {/* Solo si no hay sesión (públicas) */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recupassword" element={<RecoverPassword />} />
        <Route path="/CheckNumber" element={<CheckNumber />} />
        <Route path="/NewPassword" element={<NewPassword />} />
      </Route>

      {/* Rutas protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<Product />} />
        <Route path="/products/:nombre" element={<ProductDetail />} />
        <Route path="/shoppingcart" element={<ShoppingCart />} />
        <Route path="/category" element={<Category />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/checkout" element={<CheckoutInfo />} />
        <Route path="/creditform" element={<CreditForm />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/reviews" element={<Reviews />} />
      </Route>

      {/* Rutas accesibles sin importar autenticación */}
      <Route path="/contactus" element={<ContactUs />} />
      <Route path="/terminos" element={<TermsAndConditions />} />
    </Routes>

  );
}

export default App;
