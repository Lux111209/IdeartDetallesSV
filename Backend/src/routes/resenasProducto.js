import express from 'express';
import resenaProductoController from '../controllers/ResenaProductoController.js';
import multer from 'multer';

const upload = multer({dest: "public/"});

const router = express.Router();

// CRUD principal
router.route("/")
  .get(resenaProductoController.getResenasProducto)
  .post(upload.array('img', 5), resenaProductoController.createResenaProducto);

router.route("/:id")
  .get(resenaProductoController.getResenaProductoById)
  .put(upload.array('img', 5), resenaProductoController.updateResenaProducto)
  .delete(resenaProductoController.deleteResenaProducto);

export default router;