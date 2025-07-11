import express from 'express';
const router = express.Router();
import productsController from '../controllers/productsController.js';
import multer from "multer";

const upload = multer({dest:"public/"})


//Nos aseguramos que exista la carpeta de subida 

router.route("/")
  .get(productsController.getAllProducts)
  .post(upload.array("images"), productsController.insertProduct);

router.route("/:id")
  .get(productsController.getProductById)
  .put(upload.array("images"), productsController.updateProduct)
  .delete(productsController.deleteProduct);

export default router;


