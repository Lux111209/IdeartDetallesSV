import dotenv from "dotenv";
dotenv.config();

export const config = {
    // Puerto del servidor
    PORT: process.env.PORT,
    
    // Entorno de desarrollo
    NODE_ENV: process.env.NODE_ENV || 'development',
    
    // URL del frontend para CORS
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5174",
    
    // Configuración de la base de datos
    DB: {
        URI: process.env.DB_URI
    },
    
    // Configuración JWT
    JWT: {
        SECRET: process.env.JWT_SECRET || "default_secret_key",
        EXPIRES: process.env.JWT_EXPIRES || "30d",
    },
    
    // Configuración de email
    EMAIL: {
        USER: process.env.USER_EMAIL,
        PASSWORD: process.env.USER_PASS,
    },
    
    // Configuración de administrador
    ADMIN: {
        EMAIL: process.env.ADMIN_EMAIL,
        PASSWORD: process.env.ADMIN_PASSWORD,
    },
    
    // Configuración de Cloudinary
    CLOUDINARY: {
        CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
        API_KEY: process.env.CLOUDINARY_API_KEY,
        API_SECRET: process.env.CLOUDINARY_API_SECRET,
        SECURE: true
    },
};

// Exportar configuración por defecto
export default config;