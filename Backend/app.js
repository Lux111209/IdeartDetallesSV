// Importar todo lo de la librería "express"
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import jsonwebtoken from "jsonwebtoken";
import { config } from "./config.js";

// Importar rutas existentes
import productRoutes from "./src/routes/products.js";
import loginRoutes from "./src/routes/login.js";
import logoutRoutes from "./src/routes/logout.js";
import carritoRoutes from "./src/routes/carrito.js";
import registerUserRoutes from "./src/routes/registerUser.js";
import ofertasRoutes from "./src/routes/ofertas.js";
import provedoresRoutes from "./src/routes/Provedores.js";
import resenasGeneralRoutes from "./src/routes/resenasGeneral.js";
import resenasProductoRoutes from "./src/routes/resenasProducto.js";
import userRoutes from "./src/routes/User.js";
import ventasRoutes from "./src/routes/venta.js";
import personalizedProducts from "./src/routes/personalizedProducts.js";

// Importar middleware de validación (cuando lo tengas)
import { validateAuthToken } from "./src/middlewares/validateAuthToken.js";
const allowedOrigins = ["http://localhost:5174", "http://localhost:5173"]
// Crear una instancia de Express
const app = express();

// Configuración de CORS
app.use(
  cors({
    origin: config.FRONTEND_URL,
    credentials: true, // Permitir envío de cookies y credenciales
  })
);

// Middleware para analizar JSON y cookies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Servir archivos estáticos (imágenes de productos, etc.)
app.use('/uploads', express.static('uploads'));

// ===== RUTAS PÚBLICAS (sin autenticación requerida) =====
app.use("/api/login", loginRoutes);
app.use("/api/logout", logoutRoutes);
app.use("/api/registerUser", registerUserRoutes);

// Rutas de productos - PÚBLICAS para visualización
app.use("/api/products", productRoutes);

// Rutas de ofertas - PÚBLICAS para visualización
app.use("/api/ofertas", ofertasRoutes);

// ===== RUTAS PROTEGIDAS POR AUTENTICACIÓN =====
// (Aquí puedes agregar middleware de autenticación más tarde)

// Rutas para usuarios autenticados
app.use("/api/carrito", carritoRoutes);
app.use("/api/proveedores", provedoresRoutes);
app.use("/api/resenasgeneral", resenasGeneralRoutes);
app.use("/api/resenasproducto", resenasProductoRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ventas",ventasRoutes);
app.use("/api/productPersonalized",personalizedProducts);

// Ruta para verificar autenticación (útil para el frontend)
app.get("/api/auth/verify", (req, res) => {
  try {
    const { authToken } = req.cookies;
    
    if (!authToken) {
      return res.status(401).json({ 
        success: false, 
        message: "No token found" 
      });
    }

    const decoded = jsonwebtoken.verify(authToken, config.JWT.SECRET);
    
    res.json({
      success: true,
      user: {
        id: decoded.id,
        userType: decoded.userType
      }
    });
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: "Invalid token" 
    });
  }
});

// Ruta de salud del servidor
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Servidor funcionando correctamente",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});



// Exportar la instancia de la aplicación para poder usar Express en otros archivos
export default app;