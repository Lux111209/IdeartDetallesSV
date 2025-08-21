import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoutes";
import PublicRoute from "./routes/PublicRoutes";

// Páginas
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
import Language from "./pages/Language";
import EmailVerification from "./pages/EmailVerification";
import RecoverPassword from "./pages/RecoverPassword";
import Favorites from "./pages/Favorites";
import Promotions from "./pages/Promotions";

function App() {
  return (
    <Routes>
      {/* Redirección inicial */}
      <Route path="/" element={<Navigate to="/register" replace />} />

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
        <Route path="/language" element={<Language />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/promotions" element={<Promotions />} />
      </Route>

      {/* Rutas públicas */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recover-password" element={<RecoverPassword />} />
      </Route>

      {/* Rutas accesibles a todos */}
      <Route path="/contactus" element={<ContactUs />} />
      <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
      <Route path="/verificar-email" element={<EmailVerification />} />

      {/* Ruta por defecto */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
