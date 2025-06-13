import express from 'express';
const router = express.Router();
import productsController from '../controllers/productsController.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';



//Nos aseguramos que exista la carpeta de subida 

const uploadDir = path.join(process.cwd(), "public/uploads");

if (!fs.existsSync(uploadDir)) {
    
}