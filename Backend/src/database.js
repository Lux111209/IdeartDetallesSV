import mongoose from "mongoose";
import dotenv from 'dotenv';
import { config } from "./config.js";
//cargamos la variable de entorno
dotenv.config();

//Configuramos la Uri

const URI = config.bd.URI;


//Funcion para conectar a MongoDb con reinterntos 

const connectWithRetry  = () => {
     console.log('Trying to connect to mongoDB....');

     mongoose.connect(URI,{
          useNewUrlParser:true,
          useUnifiedTopology: true,
          serverSelectionTimeoutMS: 5000,  // Timeout para selección de servidor
          socketTimeoutMS: 45000,          // Tiempo de espera para poder realizar operaciones
          family: 4                        // Usar IPv4, evita problemas en algunos entornos
     }).catch(err => {
       console.error('Error in the configuration of MongoDb',err);
       console.log('Retryning in 5 seconds....');
       setTimeout(connectWithRetry,5000);// Retry after 5 seconds

     });
};
//INicia conexion a la bd
connectWithRetry();

// in the const y keep the conection , can have different values 
const connection = mongoose.connection;


// Evento para cunado se conencte a la db
connection.once("open",  () => {
    console.log('Database is connected');
});


//evento q detecte si se desconecta

connection.on("disconnected", () => {
    console.log("Db  is disconnected ");
    connectWithRetry(); //Retry to reconnect automatic
    
});

//evento parta detectar algun error

connection.on("error", (err) => {
    console.log("DB CONECCTION ERROR;",err);

});


export default mongoose;







