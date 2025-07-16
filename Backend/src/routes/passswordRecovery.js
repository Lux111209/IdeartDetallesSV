import { Router } from "express";
import recoveryPasswordController from "../controllers/recoveryPasswordController.js";

const router = Router();

// POST /api/passwordRecovery/requestCode
router.post("/requestCode", recoveryPasswordController.requestCode);

// POST /api/passwordRecovery/verifyCode
router.post("/verifyCode", recoveryPasswordController.verifyCode);

// POST /api/passwordRecovery/newPassword
router.post("/newPassword", recoveryPasswordController.newPassword);

export default router;
