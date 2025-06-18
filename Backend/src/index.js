//*archivo es el punto de entrada principal para nuestra appp configuramos
//  el servidor de expres escuhando el puerto 
// IMOROTAMOS APP.JS Y ESTABLECEMOS LA CONEXION A LA DB


import app from './app.js';
import database from './database.js';
import dotenv from 'dotenv';

dotenv.config();

import { config } from './config.js';

//Funcion para poder inciar el servidor

async function main(){
 const port = config.server.port;//Definimos ell puerto de app
 app.listen(port);//Hacemos que la app escuche el puerto
 console.log("Server runnig on port",port);//Mandamos un mensaje por consola para vericar que este corriendo 


}

main();

