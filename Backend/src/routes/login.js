import express from 'express';
const router = express.Router();


import loginController   from '../controllers/logincontroller.js';
router.route("/").post(loginController.login);

export default router;