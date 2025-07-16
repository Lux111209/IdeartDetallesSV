import express from "express";
import registerUserController from "../controllers/registerUserController.js";

const router = express.Router();

router.route("/verifyCodeEmail").post(registerUserController.verifyCodeEmail);

export default router;
