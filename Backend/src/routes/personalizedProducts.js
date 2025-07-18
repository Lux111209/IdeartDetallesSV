import express from 'express';
import personalizedProductsController from '../controllers/PersonalizedProducts.js';

const router = express.Router();

console.log('🛣️ Configurando rutas de productos personalizados...');

// 📋 RUTA PRINCIPAL - OBTENER TODOS
router.get('/', (req, res) => {
    console.log(' GET /api/personalized-products llamado');
    personalizedProductsController.getAllPersonalizedProducts(req, res);
});

// 📋 OBTENER POR ID
router.get('/:id', (req, res) => {
    console.log(`GET /api/personalized-products/${req.params.id} llamado`);
    personalizedProductsController.getPersonalzizedProdcutById(req, res);
});

// ✅ CREAR NUEVO
router.post('/', (req, res) => {
    console.log(' POST /api/personalized-products llamado');
    personalizedProductsController.insertPersonalizedProduct(req, res);
});

// 🎯 ACTUALIZAR ESTADO
router.put('/:id/estado', (req, res) => {
    console.log(` PUT /api/personalized-products/${req.params.id}/estado llamado`);
    personalizedProductsController.updateEstadoSolicitud(req, res);
});

// ✏️ ACTUALIZAR COMPLETO
router.put('/:id', (req, res) => {
    console.log(` PUT /api/personalized-products/${req.params.id} llamado`);
    personalizedProductsController.updatePersonalizedProduct(req, res);
});

// 🗑️ ELIMINAR
router.delete('/:id', (req, res) => {
    console.log(` DELETE /api/personalized-products/${req.params.id} llamado`);
    personalizedProductsController.deletePersonalizedProduct(req, res);
});

console.log('✅ Rutas de productos personalizados configuradas');

export default router;