// Array de métodos (CRUD)
const userController = {};
import User from "../models/User.js";

// SELECT - Obtener todos los usuarios
userController.getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

// INSERT - Crear un nuevo usuario
userController.createUser = async (req, res) => {
  const { correo, password, nombre, fechaNacimiento, favoritos } = req.body;
  const newUser = new User({ correo, password, nombre, fechaNacimiento, favoritos });
  await newUser.save();
  res.json({ message: "Usuario guardado" });
};

// DELETE - Eliminar un usuario por ID
userController.deleteUser = async (req, res) => {
  const deletedUser = await User.findByIdAndDelete(req.params.id);
  if (!deletedUser) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }
  res.json({ message: "Usuario eliminado" });
};

// UPDATE - Actualizar un usuario por ID
userController.updateUser = async (req, res) => {
  const { correo, password, nombre, fechaNacimiento, favoritos } = req.body;
  await User.findByIdAndUpdate(
    req.params.id,
    { correo, password, nombre, fechaNacimiento, favoritos },
    { new: true }
  );
  res.json({ message: "Usuario actualizado" });
};

export default userController;