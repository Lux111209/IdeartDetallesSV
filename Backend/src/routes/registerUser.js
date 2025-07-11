import express from "express";

const router = express.Router();
import registerUserController from "../controllers/registerUserController.js";

router.route("/").post(registerUserController.register);

// ✅ Opción 1: Usar router.route() correctamente
router.route("/verifyCodeEmail").post(registerUserController.verifyCodeEmail);

// router.post("/verifyCodeEmail", registerUserController.verifyCodeEmail);

export default router;