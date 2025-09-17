import express from 'express';

import { createPayment,paymentWebhook} from '../controllers/paymentscontroller.js';

const router = express.Router();


router.post("/create", createPayment);
router.post("/webhook", paymentWebhook);

export default router;