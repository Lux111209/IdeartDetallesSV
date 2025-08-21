import express from "express";
import {
  getDashboardData,
  getProductosPorCategoria,
  getStockBajo,
  getPromedioResenasProductos,
  getPromedioResenasGenerales,
  getVentasPorMes
} from "../controllers/dashboardController.js";

const router = express.Router();

// Endpoint único para el dashboard
router.get("/", getDashboardData);

// Endpoints individuales (opcional)
router.get("/productos-por-categoria", getProductosPorCategoria);
router.get("/stock-bajo", getStockBajo);
router.get("/promedio-resenas-productos", getPromedioResenasProductos);
router.get("/promedio-resenas-generales", getPromedioResenasGenerales);
router.get("/ventas-por-mes", getVentasPorMes);

export default router;
