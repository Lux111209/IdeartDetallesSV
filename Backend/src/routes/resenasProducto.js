import express from 'express';
import resenaProductoController from '../controllers/ResenaProductoController.js';
import multer from 'multer';

// Configuración de multer para subida de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Asegúrate de que esta carpeta exista
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

// Rutas básicas CRUD
router.get('/', resenaProductoController.getResenasProducto);
router.get('/verificadas', resenaProductoController.getResenasVerificadas); // ANTES de /:id
router.get('/producto/:id_producto', resenaProductoController.getResenasByProducto); // ANTES de /:id
router.get('/usuario/:id_user', resenaProductoController.getResenasByUsuario); // ANTES de /:id
router.get('/:id', resenaProductoController.getResenaProductoById);

// Rutas con upload de imágenes
router.post('/', upload.array('img', 5), resenaProductoController.createResenaProducto);
router.put('/:id', upload.array('img', 5), resenaProductoController.updateResenaProducto);

router.delete('/:id', resenaProductoController.deleteResenaProducto);

// Rutas especiales
router.put('/:id/util', resenaProductoController.marcarUtil);
router.put('/:id/respuesta-vendedor', resenaProductoController.agregarRespuestaVendedor);
router.put('/:id/agregar-tag', resenaProductoController.agregarTag);
router.put('/:id/remover-tag', resenaProductoController.removerTag);

export default router;