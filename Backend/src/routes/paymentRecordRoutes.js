const express = require("express");
const router = express.Router();
const controller = require("../controllers/paymentRecordsController");

router.post("/", controller.createPaymentRecord);
router.get("/", controller.getAllPaymentRecords);
router.put("/:id", controller.updatePaymentRecord);
router.delete("/:id", controller.deletePaymentRecord);

module.exports = router;
