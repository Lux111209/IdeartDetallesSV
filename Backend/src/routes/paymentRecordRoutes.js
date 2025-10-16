import express from "express";
const router = express.Router();
import controller from "../controllers/paymentRecordsController";

router.post("/", controller.createPaymentRecord);
router.get("/", controller.getAllPaymentRecords);
router.put("/:id", controller.updatePaymentRecord);
router.delete("/:id", controller.deletePaymentRecord);

export default router;