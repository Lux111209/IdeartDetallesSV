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

router.get("/usuario/:userId", CarritoCompraController.getCarritoByUser);


export default router;

