// src/routes/Ofertas.js
import express from "express";
import OfertasController from "../controllers/OfertasController.js";

const router = express.Router();

// GET - Obtener todas las ofertas
router.get("/", OfertasController.getOfertas);

// GET - Obtener estadísticas de ofertas
router.get("/stats", OfertasController.getEstadisticasOfertas);

// GET - Obtener ofertas activas
router.get("/activas", OfertasController.getOfertasActivas);

// GET - Obtener oferta por ID
router.get("/:id", OfertasController.getOfertaById);

// GET - Verificar si oferta está vigente
router.get("/:id/vigente", OfertasController.isOfertaVigente);

// GET - Obtener ofertas por producto
router.get("/producto/:id_producto", OfertasController.getOfertasByProducto);

// POST - Crear nueva oferta
router.post("/", OfertasController.createOferta);

// PUT - Actualizar oferta
router.put("/:id", OfertasController.updateOferta);

// PUT - Activar/Desactivar oferta
router.put("/:id/toggle", OfertasController.toggleOferta);

// DELETE - Eliminar oferta
router.delete("/:id", OfertasController.deleteOferta);

export default router;