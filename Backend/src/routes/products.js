import express from 'express';
const router = express.Router();
import productsController from '../controllers/productsController.js';
import { uploadFlexible } from '../config/multer.js';


//Nos aseguramos que exista la carpeta de subida 
router.route("/")
.get(productsController.getProducts)
.post(uploadFlexible, productsController.createProducts);

router.route("/:id")
.get(productsController.getProductById)
.put(uploadFlexible, productsController.updateProduct)
.delete(productsController.deleteProduct);

export default router;


