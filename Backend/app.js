// server.js o app.js

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

<<<<<<< HEAD
// Crear instancia de Express
const app = express();

// Middlewares globales
app.use(cors({
  origin: config.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
=======
// Importar middleware de validación (cuando lo tengas)
import { validateAuthToken } from "./src/middlewares/validateAuthToken.js";
// Crear una instancia de Express
const app = express();

// Configuración de CORS
app.use(
  cors({
    origin: ["http://localhost:5174", "http://localhost:5173"],
    credentials: true
  })
);

// Middleware para analizar JSON y cookies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
>>>>>>> 03e4952f1a61391812fa175330ff415d4bbfc0a2
app.use(cookieParser());

// Servir archivos estáticos (por ejemplo, imágenes subidas)
app.use("/uploads", express.static("uploads"));

// ------------------ RUTAS ------------------ //

// Rutas públicas
app.use("/api/login", loginRoutes);
app.use("/api/logout", logoutRoutes);
app.use("/api/registerUser", registerUserRoutes);
app.use("/api/products", productRoutes);
app.use("/api/ofertas", ofertasRoutes);

// Rutas protegidas
app.use("/api/carrito", carritoRoutes);
app.use("/api/proveedores", provedoresRoutes);
app.use("/api/resenasgeneral", resenasGeneralRoutes);
app.use("/api/resenasproducto", resenasProductoRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ventas", ventasRoutes);
app.use("/api/productPersonalized", personalizedProducts);

// Ruta para verificar autenticación
app.get("/api/auth/verify", (req, res) => {
  try {
    const { authToken } = req.cookies;
    if (!authToken) {
      return res.status(401).json({
        success: false,
        message: "No token found",
      });
    }

    const decoded = jsonwebtoken.verify(authToken, config.JWT.SECRET);

    res.json({
      success: true,
      user: {
        id: decoded.id,
        userType: decoded.userType,
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
});

// Ruta de prueba para saber que la API está viva
app.get("/", (req, res) => {
  res.send("API funcionando");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Servidor funcionando correctamente",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ------------------ INICIO DEL SERVIDOR ------------------ //

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

export default app;
