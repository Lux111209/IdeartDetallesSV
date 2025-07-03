import dotenv from 'dotenv';
dotenv.config(); 

import app from './src/app.js';
import './src/database.js';
import { config } from './src/config.js';

async function main() {
  try {
    const port = config.server.port || 3000;
    app.listen(port, () => {
      console.log("Server running on port", port);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
}

main();