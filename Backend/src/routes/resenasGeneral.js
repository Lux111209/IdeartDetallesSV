import express from 'express';
import resenaGeneralController from '../controllers/resenaGeneralController.js';

const router = express.Router();

// Rutas básicas CRUD
router.get('/', resenaGeneralController.getResenas);
router.get('/producto/:id_producto', resenaGeneralController.getResenasByProducto); // ANTES de /:id
router.get('/usuario/:id_user', resenaGeneralController.getResenasByUsuario); // ANTES de /:id
router.get('/:id', resenaGeneralController.getResenaById);
router.post('/', resenaGeneralController.createResena);
router.put('/:id', resenaGeneralController.updateResena);
router.delete('/:id', resenaGeneralController.deleteResena);

// Rutas especiales
router.put('/:id/util', resenaGeneralController.marcarUtil);

export default router;