import express from 'express';
import resenaProductoController from '../controllers/ResenaProductoController.js';
import multer from 'multer';

// Configuración de multer para subida de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Asegúrate de que esta carpeta exista
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = file.originalname.split('.').pop();
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + extension);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB límite
    files: 5 // máximo 5 archivos
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'), false);
    }
  }
});

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