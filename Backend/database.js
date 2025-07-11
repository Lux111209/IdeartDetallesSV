import mongoose from "mongoose";
import { config } from "./config.js";

// Conectar a la base de datos
mongoose.connect(config.DB.URI);

// -------- Comprobar que todo funciona ----------

const connection = mongoose.connection;

// Ver si funciona la conexión
connection.once("open", () => {
  console.log("✅ Base de datos conectada exitosamente");
});

// Ver si se desconectó
connection.on("disconnected", () => {
  console.log("❌ Base de datos desconectada");
});

// Ver si hay un error
connection.on("error", (error) => {
  console.log("❌ Error en la conexión a la base de datos:", error.message);
});

export default mongoose;