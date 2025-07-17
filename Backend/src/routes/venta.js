// src/routes/venta.js
import express from "express";
import ventasController from "../controllers/ventasController.js";

const router = express.Router();

// GET - Obtener todas las ventas
router.get("/", ventasController.getallVenta);

// GET - Obtener estadísticas de ventas
router.get("/estadisticas", ventasController.getEstadisticas);

// GET - Obtener ventas por estado
router.get("/estado/:estado", ventasController.getVentasByEstado);

// GET - Obtener venta por ID
router.get("/:id", ventasController.getVentaByiD);

// POST - Crear nueva venta
router.post("/", ventasController.createVenta);

// PUT - Actualizar venta
router.put("/:id", ventasController.updateVenta);

// DELETE - Eliminar venta
router.delete("/:id", ventasController.deleteVenta);

export default router;