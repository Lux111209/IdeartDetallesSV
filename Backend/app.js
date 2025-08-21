// server.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import jsonwebtoken from "jsonwebtoken";
import { config } from "./config.js";

// Importar rutas
import productRoutes from "./src/routes/products.js";
import loginRoutes from "./src/routes/login.js";
import logoutRoutes from "./src/routes/logout.js";
import carritoRoutes from "./src/routes/carrito.js";
import registerUserRoutes from "./src/routes/registerUser.js";
import ofertasRoutes from "./src/routes/Ofertas.js";
import provedoresRoutes from "./src/routes/Provedores.js";
import resenasGeneralRoutes from "./src/routes/resenasGeneral.js";
import resenasProductoRoutes from "./src/routes/resenasProducto.js";
import userRoutes from "./src/routes/User.js";
import ventasRoutes from "./src/routes/venta.js";
import personalizedProducts from "./src/routes/personalizedProducts.js";
import passwordRecovery from "./src/routes/passswordRecovery.js";
import dashboardRoutes from "./src/routes/dashboardRoutes.js"; // NUEVO

const app = express();

// ==================== CORS ====================
const allowedOrigins = [config.FRONTEND_URL || "http://localhost:5173"];

// Configuración CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // permitir requests sin origin (ej: Postman)
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `La política de CORS bloqueó la solicitud desde: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // ✅ permitir cookies
}));

// ==================== MIDDLEWARES ====================
  origin: config.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));

// Middleware para analizar JSON y datos URL-encoded
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use("/uploads", express.static("uploads")); // servir imágenes/archivos

// ==================== RUTAS ====================
// Públicas
app.use("/api/login", loginRoutes);
app.use("/api/logout", logoutRoutes);
app.use("/api/registerUser", registerUserRoutes);
app.use("/api/products", productRoutes);
app.use("/api/ofertas", ofertasRoutes);
app.use("/api/passwordRecovery", passwordRecovery);

// Protegidas (requieren token/cookie en el futuro si aplicas middleware)
app.use("/api/carrito", carritoRoutes);
app.use("/api/proveedores", provedoresRoutes);
app.use("/api/resenasgeneral", resenasGeneralRoutes);
app.use("/api/resenasproducto", resenasProductoRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ventas", ventasRoutes);
app.use("/api/personalized-products", personalizedProducts);

// ==================== AUTH CHECK ====================
// NUEVA RUTA PARA DASHBOARD
app.use("/api/dashboard", dashboardRoutes);

// Ruta de verificación de token
app.get("/api/auth/verify", (req, res) => {
  try {
    const { authToken } = req.cookies;
    if (!authToken) return res.status(401).json({ success: false, message: "No token found" });
    if (!authToken) return res.status(401).json({ success: false, message: "No token found" });

    const decoded = jsonwebtoken.verify(authToken, config.JWT.SECRET);
    res.json({ success: true, user: { id: decoded.id, userType: decoded.userType } });
    res.json({ success: true, user: { id: decoded.id, userType: decoded.userType } });
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token" });
    res.status(401).json({ success: false, message: "Invalid token" });
  }
});

// ==================== SALUD ====================
app.get("/", (req, res) => res.send("API funcionando 🚀"));
app.get("/health", (req, res) =>
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() })
);
app.get("/", (req, res) => res.send("API funcionando"));
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Servidor funcionando correctamente", timestamp: new Date().toISOString(), uptime: process.uptime() });
});

// ==================== SERVIDOR ====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Servidor escuchando en http://localhost:${PORT}`));
app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));

export default app;
