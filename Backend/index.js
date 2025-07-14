import app from "./app.js";
import "./database.js";
import { config } from "./config.js";

// Función principal para iniciar el servidor
async function main() {
  try {
    
    const port = config.PORT || 5000;
    
    app.listen(port, () => {
      console.log(`🚀 Servidor activo en puerto ${port}`);
      console.log(`🌐 URL: http://localhost:${port}`);
      console.log(`Servidor corriendo en http://localhost:${port}`);
      console.log(`❤️ IdeArts check: http://localhost:${port}/idearts`);
      console.log(`📊 Entorno: ${config.NODE_ENV}`);
      console.log(`🔗 Frontend URL configurado: ${config.FRONTEND_URL}`);
      
      // Mostrar información de Cloudinary si está configurado
      if (config.CLOUDINARY.CLOUD_NAME) {
        console.log(`☁️ Cloudinary: ${config.CLOUDINARY.CLOUD_NAME}`);
      }
      
      console.log('===================================');
      console.log('🎯 ¡Servidor listo para recibir peticiones!');
      console.log('===================================');
    });
    
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  console.error('❌ Excepción no capturada:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promesa rechazada no manejada:', reason);
  process.exit(1);
});

// Manejo de cierre graceful
process.on('SIGTERM', () => {
  console.log('📴 Recibida señal SIGTERM, cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n📴 Recibida señal SIGINT, cerrando servidor...');
  process.exit(0);
});

main();