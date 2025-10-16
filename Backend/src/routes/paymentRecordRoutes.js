import express from "express";
const router = express.Router();
import controller from "../controllers/paymentRecordsController.js";

router.route("/")
.post(controller.createPaymentRecord)
.get(controller.getAllPaymentRecords);

router.route("/:id")
.put(controller.updatePaymentRecord)
.delete(controller.deletePaymentRecord);

export default router;