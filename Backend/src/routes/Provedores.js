import express from "express";
import provedoresController from "../controllers/provedoresController.js";

const router = express.Router();

router
  .route("/")
  .get(provedoresController.getProvedores)
  .post(provedoresController.createProvedor);

router
  .route("/:id")
  .put(provedoresController.updateProvedor)
  .delete(provedoresController.deleteProvedor);

export default router;