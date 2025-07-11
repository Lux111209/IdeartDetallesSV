import express from "express";
import OfertasController from "../controllers/ofertasController.js";

const router = express.Router();

router
  .route("/")
  .get(OfertasController.getOfertas)
  .post(OfertasController.createOferta);

router
  .route("/:id")
  .put(OfertasController.updateOferta)
  .delete(OfertasController.deleteOferta);

export default router;