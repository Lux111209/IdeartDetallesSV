import User from "../models/User.js";

// Objeto que agrupa los métodos del controlador
const userController = {};

// Obtener todos los usuarios
userController.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error("Error al obtener usuarios:", err);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Obtener un usuario por ID
userController.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json({ user }); // Retorna el usuario dentro de un objeto
  } catch (err) {
    console.error("Error al buscar usuario:", err);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Actualizar un usuario por ID
userController.updateUser = async (req, res) => {
  const { correo, nombre, fechaNacimiento, favoritos } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { correo, nombre, fechaNacimiento, favoritos },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ user: updatedUser }); // Devuelve el usuario actualizado
  } catch (err) {
    console.error("Error al actualizar usuario:", err);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Eliminar un usuario por ID
userController.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json({ message: "Usuario eliminado" });
  } catch (err) {
    console.error("Error al eliminar usuario:", err);
    res.status(500).json({ message: "Error del servidor" });
  }
};

export default userController;
