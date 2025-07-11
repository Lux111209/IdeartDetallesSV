import express from 'express';

const router = express.Router();
import ventaController from "../controllers/ventasController.js";

router.route("/")
.get(ventaController.getallVenta)
.post(ventaController.createVenta);

router.route("/:id")
.get(ventaController.getVentaByiD)
.put(ventaController.updateVenta)
.delete(ventaController.deleteVenta);

export default router;