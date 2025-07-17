import express from "express";
import registerUserController from "../controllers/registerUserController.js";

const router = express.Router();


router.post("/", registerUserController.register);

router.post("/verifyCodeEmail", registerUserController.verifyCodeEmail);

// Log para verificar que la ruta se ha cargado correctamente
console.log("Ruta de registro cargada");

// Ruta para registrar nuevo usuario
router.post("/register", registerUserController.register);

// Ruta para verificar código enviado al email
router.post("/verify", registerUserController.verifyCodeEmail);

//router.route("/verifyCodeEmail").post(registerUserController.verifyCodeEmail);



export default router;
