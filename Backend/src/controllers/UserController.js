import User from "../models/User.js";
import mongoose from "mongoose";

const userController = {};

// ===== OBTENER TODOS LOS USUARIOS =====
userController.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // nunca devolver password
    res.status(200).json({ users });
  } catch (err) {
    console.error("Error al obtener usuarios:", err);
    res.status(500).json({
      message: "Error del servidor al obtener usuarios",
      error: err.message,
    });
  }
};

// ===== OBTENER USUARIO POR ID =====
userController.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de usuario inválido" });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error("Error al buscar usuario:", err);
    res.status(500).json({
      message: "Error del servidor al buscar usuario",
      error: err.message,
    });
  }
};

// ===== ACTUALIZAR USUARIO =====
userController.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { correo, nombre, fechaNacimiento, favoritos } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de usuario inválido" });
    }

    const updateData = {};

    // Nombre
    if (nombre !== undefined) {
      if (typeof nombre !== "string" || nombre.trim().length === 0) {
        return res.status(400).json({ message: "El nombre no puede estar vacío" });
      }
      updateData.nombre = nombre.trim();
    }

    // Correo
    if (correo !== undefined) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(correo.trim())) {
        return res.status(400).json({ message: "Formato de correo inválido" });
      }

      const existeCorreo = await User.findOne({
        correo: correo.trim().toLowerCase(),
        _id: { $ne: id },
      });

      if (existeCorreo) {
        return res.status(409).json({ message: "Ya existe otro usuario con este correo" });
      }

      updateData.correo = correo.trim().toLowerCase();
    }

    // Fecha de nacimiento
    if (fechaNacimiento !== undefined) {
      const fecha = new Date(fechaNacimiento);

      if (isNaN(fecha.getTime())) {
        return res.status(400).json({ message: "Fecha de nacimiento inválida" });
      }

      if (fecha > new Date()) {
        return res.status(400).json({ message: "La fecha de nacimiento no puede ser futura" });
      }

      updateData.fechaNacimiento = fecha;
    }

    // Favoritos
    if (favoritos !== undefined) {
      if (!Array.isArray(favoritos)) {
        return res.status(400).json({ message: "Los favoritos deben ser un array" });
      }

      for (const favorito of favoritos) {
        if (!mongoose.Types.ObjectId.isValid(favorito)) {
          return res.status(400).json({ message: "ID de favorito inválido" });
        }
      }

      updateData.favoritos = favoritos;
    }

    // Actualizar usuario
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
      select: "-password",
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({
      message: "Usuario actualizado exitosamente",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Error al actualizar usuario:", err);
    res.status(500).json({
      message: "Error del servidor al actualizar usuario",
      error: err.message,
    });
  }
};

// ===== ELIMINAR USUARIO =====
userController.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de usuario inválido" });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.status(200).json({ message: "Usuario eliminado exitosamente" });
  } catch (err) {
    console.error("Error al eliminar usuario:", err);
    res.status(500).json({
      message: "Error del servidor al eliminar usuario",
      error: err.message,
    });
  }
};

export default userController;
