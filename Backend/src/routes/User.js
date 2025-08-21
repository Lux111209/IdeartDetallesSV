import express from "express";
import userController from "../controllers/UserController.js";

const router = express.Router();

// CRUD de usuarios
router.get("/", userController.getUsers);        // Obtener todos
router.get("/:id", userController.getUserById);  // Obtener por ID
router.put("/:id", userController.updateUser);   // Actualizar
router.delete("/:id", userController.deleteUser); // Eliminar

export default router;
