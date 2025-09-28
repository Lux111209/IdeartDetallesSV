import express from "express";
import userController from "../controllers/UserController.js";
import { validateAuthToken } from "../middlewares/validateAuthToken.js";

const router = express.Router();

// CRUD de usuarios
router.get("/", userController.getUsers);        
router.get("/:id", userController.getUserById);  
router.put("/:id", userController.updateUser);   
router.delete("/:id", userController.deleteUser);

// Nuevo: obtener perfil del usuario logueado
router.get("/me/profile", validateAuthToken(), userController.getUserProfile);

export default router;
