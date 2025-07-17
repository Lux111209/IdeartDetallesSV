import User from "../models/User.js";
import mongoose from "mongoose";

// Objeto que agrupa los métodos del controlador
const userController = {};

// ===== OBTENER TODOS LOS USUARIOS =====
userController.getUsers = async (req, res) => {
  try {
    // Buscar todos los usuarios en la base de datos
    const users = await User.find();
    
    // Respuesta exitosa con la lista de usuarios
    res.status(200).json(users);
  } catch (err) {
    // Log del error para debugging
    console.error("Error al obtener usuarios:", err);
    
    // Error del servidor
    res.status(500).json({ 
      message: "Error del servidor al obtener usuarios",
      error: err.message 
    });
  }
};

// ===== OBTENER USUARIO POR ID =====
userController.getUserById = async (req, res) => {
  try {
    // Validar que el ID sea un ObjectId válido de MongoDB
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID de usuario inválido" });
    }

    // Buscar el usuario por ID en la base de datos
    const user = await User.findById(req.params.id);
    
    // Verificar si el usuario existe
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    
    // Respuesta exitosa con el usuario encontrado
    res.status(200).json({ user });
  } catch (err) {
    // Log del error para debugging
    console.error("Error al buscar usuario:", err);
    
    // Error del servidor
    res.status(500).json({ 
      message: "Error del servidor al buscar usuario",
      error: err.message 
    });
  }
};

// ===== ACTUALIZAR USUARIO =====
userController.updateUser = async (req, res) => {
  try {
    const { correo, nombre, fechaNacimiento, favoritos } = req.body;

    // Validar que el ID del usuario sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID de usuario inválido" });
    }

    // Crear objeto de actualización solo con campos enviados
    const updateData = {};

    // Validar y agregar nombre si se envía
    if (nombre) {
      // Verificar que el nombre no esté vacío después de quitar espacios
      if (nombre.trim().length === 0) {
        return res.status(400).json({ message: "El nombre no puede estar vacío" });
      }
      updateData.nombre = nombre.trim();
    }

    // Validar y agregar correo si se envía
    if (correo) {
      // Validar formato básico de email con regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(correo.trim())) {
        return res.status(400).json({ message: "Formato de correo inválido" });
      }
      
      // Verificar que no exista otro usuario con el mismo correo
      const existeCorreo = await User.findOne({ 
        correo: correo.trim().toLowerCase(),
        _id: { $ne: req.params.id } // Excluir el usuario actual de la búsqueda
      });
      if (existeCorreo) {
        return res.status(409).json({ message: "Ya existe otro usuario con este correo" });
      }
      
      // Normalizar correo: minúsculas y sin espacios
      updateData.correo = correo.trim().toLowerCase();
    }

    // Validar y agregar fecha de nacimiento si se envía
    if (fechaNacimiento) {
      const fecha = new Date(fechaNacimiento);
      
      // Verificar que la fecha sea válida
      if (isNaN(fecha.getTime())) {
        return res.status(400).json({ message: "Fecha de nacimiento inválida" });
      }
      
      // Verificar que la fecha no sea futura
      if (fecha > new Date()) {
        return res.status(400).json({ message: "La fecha de nacimiento no puede ser futura" });
      }
      
      updateData.fechaNacimiento = fecha;
    }

    // Validar y agregar favoritos si se envían
    if (favoritos !== undefined) {
      // Verificar que favoritos sea un array
      if (!Array.isArray(favoritos)) {
        return res.status(400).json({ message: "Los favoritos deben ser un array" });
      }
      
      // Validar que cada favorito sea un ObjectId válido
      for (let favorito of favoritos) {
        if (!mongoose.Types.ObjectId.isValid(favorito)) {
          return res.status(400).json({ message: "ID de favorito inválido" });
        }
      }
      
      updateData.favoritos = favoritos;
    }

    // Actualizar el usuario en la base de datos
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true } // Retornar el documento actualizado
    );

    // Verificar si el usuario existe
    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Respuesta exitosa con el usuario actualizado
    res.status(200).json({ 
      message: "Usuario actualizado exitosamente",
      user: updatedUser 
    });
  } catch (err) {
    // Log del error para debugging
    console.error("Error al actualizar usuario:", err);
    
    // Error del servidor
    res.status(500).json({ 
      message: "Error del servidor al actualizar usuario",
      error: err.message 
    });
  }
};

// ===== ELIMINAR USUARIO =====
userController.deleteUser = async (req, res) => {
  try {
    // Validar que el ID sea un ObjectId válido de MongoDB
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID de usuario inválido" });
    }

    // Eliminar el usuario de la base de datos
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    
    // Verificar si el usuario existía
    if (!deletedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    
    // Respuesta exitosa confirmando la eliminación
    res.status(200).json({ message: "Usuario eliminado exitosamente" });
  } catch (err) {
    // Log del error para debugging
    console.error("Error al eliminar usuario:", err);
    
    // Error del servidor
    res.status(500).json({ 
      message: "Error del servidor al eliminar usuario",
      error: err.message 
    });
  }
};

export default userController;