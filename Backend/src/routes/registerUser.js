import express from "express";
import registerUserController from "../controllers/registerUserController.js";

const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post("/", registerUserController.register);

// Ruta para verificar código de correo
router.post("/verifyCodeEmail", registerUserController.verifyCodeEmail);

export default router;
