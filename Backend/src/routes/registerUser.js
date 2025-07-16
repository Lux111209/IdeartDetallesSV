import express from "express";

const router = express.Router();
import registerUserController from "../controllers/registerUserController.js";

router.route("/").post(registerUserController.register);

router.route("/verifyCodeEmail").post(registerUserController.verifyCodeEmail);

export default router;