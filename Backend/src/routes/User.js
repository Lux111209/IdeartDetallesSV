import express from "express";
import userController from "../controllers/userController.js";

const router = express.Router();

router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

export default router;
