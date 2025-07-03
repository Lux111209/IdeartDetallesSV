import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import multer from "multer";

// Importar rutas existentes
import productRoutes from "./routes/products.js";
import loginRoutes from "./routes/login.js";
import logoutRoutes from "./routes/logout.js";
import CarritoCompra from "./routes/carrito.js";
import registerUser from "./routes/registerUser.js";

// Importar nuevas rutas
import ofertasRoutes from "./routes/ofertas.js";
import provedoresRoutes from "./routes/Provedores.js";
import resenasGeneralRoutes from "./routes/resenasGeneral.js";
import resenasProductoRoutes from "./routes/resenasProducto.js";
import userRoutes from "./routes/User.js";

// Configurar variables de entorno
dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de CORS
const allowedOrigins = [
// Para Vite
    "http://localhost:5174",
    process.env.FRONTEND_URL || "*"
];

app.use(cors({
    origin: function (origin, callback) {
        // Permitir requests sin origin (como mobile apps o curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes("*")) {
            return callback(null, true);
        } else {
            const msg = 'El policy de CORS no permite acceso desde el origen especificado.';
            return callback(new Error(msg), false);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

// Middlewares generales
app.use(morgan('combined')); // Logging de requests
app.use(express.json({ limit: '10mb' })); // Aumentar límite para imágenes base64
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Crear carpeta uploads si no existe
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('📁 Carpeta uploads creada');
}

// Servir archivos estáticos
app.use('/uploads', express.static(uploadsDir));

// Middleware para logging de requests (desarrollo)
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
    });
}

// Ruta de salud del servidor
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Servidor funcionando correctamente',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Ruta principal con información de la API
app.get('/', (req, res) => {
    res.json({
        message: '🚀 API E-commerce funcionando correctamente',
        version: '1.0.0',
        endpoints: {
            auth: [
                'POST /api/login',
                'POST /api/logout', 
                'POST /api/registerUser'
            ],
            products: [
                'GET /api/products',
                'GET /api/products/:id',
                'POST /api/products',
                'PUT /api/products/:id',
                'DELETE /api/products/:id'
            ],
            carrito: [
                'GET /api/carrito',
                'GET /api/carrito/:id',
                'POST /api/carrito',
                'PUT /api/carrito/:id',
                'DELETE /api/carrito/:id'
            ],
            ofertas: [
                'GET /api/ofertas',
                'GET /api/ofertas/activas',
                'GET /api/ofertas/:id',
                'POST /api/ofertas',
                'PUT /api/ofertas/:id',
                'DELETE /api/ofertas/:id'
            ],
            proveedores: [
                'GET /api/proveedores',
                'GET /api/proveedores/activos',
                'GET /api/proveedores/:id',
                'POST /api/proveedores',
                'PUT /api/proveedores/:id',
                'DELETE /api/proveedores/:id'
            ],
            resenasGeneral: [
                'GET /api/resenas-general',
                'GET /api/resenas-general/producto/:id',
                'GET /api/resenas-general/usuario/:id',
                'POST /api/resenas-general',
                'PUT /api/resenas-general/:id',
                'DELETE /api/resenas-general/:id'
            ],
            resenasProducto: [
                'GET /api/resenas-producto',
                'GET /api/resenas-producto/verificadas',
                'GET /api/resenas-producto/producto/:id',
                'POST /api/resenas-producto (con imágenes)',
                'PUT /api/resenas-producto/:id',
                'DELETE /api/resenas-producto/:id'
            ],
            users: [
                'GET /api/users',
                'GET /api/users/:id',
                'PUT /api/users/:id',
                'DELETE /api/users/:id'
            ]
        },
        features: [
            '✅ Autenticación con JWT',
            '✅ CRUD completo para todos los módulos',
            '✅ Subida de imágenes con Cloudinary',
            '✅ Sistema de reseñas avanzado',
            '✅ Gestión de ofertas',
            '✅ Manejo de proveedores',
            '✅ Carrito de compras',
            '✅ Validaciones robustas'
        ]
    });
});

// ========================== RUTAS EXISTENTES ==========================
app.use("/api/products", productRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/logout", logoutRoutes);
app.use("/api/carrito", CarritoCompra);
app.use("/api/registerUser", registerUser);

// ========================== NUEVAS RUTAS ==========================
app.use("/api/ofertas", ofertasRoutes);
app.use("/api/proveedores", provedoresRoutes);
app.use("/api/resenasgeneral", resenasGeneralRoutes);
app.use("/api/resenasproducto", resenasProductoRoutes);
app.use("/api/users", userRoutes);

// ========================== MIDDLEWARE DE MANEJO DE ERRORES ==========================

// Middleware para manejar errores de Multer (subida de archivos)
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'El archivo es demasiado grande. Máximo 5MB por archivo.',
                error: 'FILE_TOO_LARGE'
            });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: 'Demasiados archivos. Máximo 5 imágenes por request.',
                error: 'TOO_MANY_FILES'
            });
        }
        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                success: false,
                message: 'Campo de archivo inesperado.',
                error: 'UNEXPECTED_FILE'
            });
        }
    }
    
    // Error de formato JSON
    if (error.type === 'entity.parse.failed') {
        return res.status(400).json({
            success: false,
            message: 'Formato JSON inválido',
            error: 'INVALID_JSON'
        });
    }

    // Error de tamaño del payload
    if (error.type === 'entity.too.large') {
        return res.status(413).json({
            success: false,
            message: 'Payload demasiado grande',
            error: 'PAYLOAD_TOO_LARGE'
        });
    }

    next(error);
});

// Middleware para errores generales
app.use((error, req, res, next) => {
    console.error('❌ Error no manejado:', error);
    
    res.status(500).json({
        success: false,
        message: process.env.NODE_ENV === 'production' 
            ? 'Error interno del servidor' 
            : error.message,
        error: process.env.NODE_ENV === 'development' ? error.stack : 'INTERNAL_SERVER_ERROR',
        timestamp: new Date().toISOString()
    });
});

// Middleware para rutas no encontradas (404)
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
        error: 'ROUTE_NOT_FOUND',
        availableEndpoints: '/api endpoints disponibles en GET /'
    });
});

// Manejo de señales para cierre graceful
process.on('SIGTERM', () => {
    console.log('📴 SIGTERM recibido. Cerrando servidor...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('📴 SIGINT recibido. Cerrando servidor...');
    process.exit(0);
});

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
    console.error('❌ Excepción no capturada:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Promesa rechazada no manejada en:', promise, 'razón:', reason);
    process.exit(1);
});

export default app;