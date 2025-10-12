import dotenv from "dotenv";
dotenv.config();

export const config = {
    // Puerto del servidor
    PORT: process.env.PORT,
    
    // Entorno de desarrollo
    NODE_ENV: process.env.NODE_ENV ,
    
    // URL del frontend para CORS
    FRONTEND_URL: process.env.FRONTEND_URL || "https://ideart-detalles-sv-six.vercel.app/",
    
    // Configuración de la base de datos
    DB: {
        URI: process.env.DB_URI
    },
    
    // Configuración JWT
    JWT: {
        SECRET: process.env.JWT_SECRET ,
        EXPIRES: process.env.JWT_EXPIRES,
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
    //Se creo la config de wompi
    WOMPI:{
    GRANT_TYPE:process.env.GRANT_TYPE,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    AUDIENCE: process.env.AUDIENCE,

        //
    }
};

// Exportar configuración por defecto
export default config;