import express from "express";
const router = express.Router();
import CarritoCompraController from "../controllers/CarritoCompraController.js";

router.route("/")
.get(CarritoCompraController.getCarritoCompra)
.post(CarritoCompraController.createCarritoCompra);

router.route("/:id")
.get(CarritoCompraController.getCarritoCompraById)
.put(CarritoCompraController.updateCarrito)
.delete(CarritoCompraController.deleteCarrito);

export default router;

