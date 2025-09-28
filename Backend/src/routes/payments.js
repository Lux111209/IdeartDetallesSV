import express from "express";
import { getToken, testPayment, payment3ds } from "../controllers/paymentscontroller.js";

const router = express.Router();

router.post("/token", getToken);
router.post("/testPayment", testPayment);
router.post("/payment3ds", payment3ds);

export default router;
