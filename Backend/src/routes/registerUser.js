import express from "express";
import registerUserController from "../controllers/registerUserController.js";

const router = express.Router();

router.post("/", registerUserController.register);

router.post("/verifyCodeEmail", registerUserController.verifyCodeEmail);

export default router;
