import express from "express";
import cors from "cors";
import { config } from "./config.js";

const app = express();

// ✅ Configuración dinámica de CORS
const allowedOrigins = [
  "http://localhost:5173",    // desarrollo local
  config.FRONTEND_URL         // frontend en producción (Vercel)
];

app.use(cors({
  origin: (origin, callback) => {
    // Permitir requests sin "origin" (ej: Postman o curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error(`CORS bloqueado para: ${origin}`));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ✅ Middlewares
app.use(express.json());

// ✅ Rutas de ejemplo
app.get("/idearts", (req, res) => {
  res.send("❤️ IdeArts API funcionando con CORS ✅");
});

// Ejemplo ruta dashboard
app.get("/api/dashboard", (req, res) => {
  res.json({ message: "📊 Dashboard funcionando con CORS 🚀" });
});

export default app;
