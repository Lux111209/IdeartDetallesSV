import express from "express";
import loginController from "../controllers/logincontroller.js";

const router = express.Router();

router.post("/", (req, res, next) => {
  console.log("POST /api/login recibido");
  next();
}, loginController.login);

export default router;
