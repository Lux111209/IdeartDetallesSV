import User from "../models/User.js";

const userController = {
  getUsers: async (req, res) => {
    const users = await User.find();
    res.json(users);
  },
  getUserById: async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
  },
  updateUser: async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
  },
  deleteUser: async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Usuario eliminado" });
  },
  // NUEVO: perfil del usuario autenticado
  getUserProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-__v");
      if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
  }
};

export default userController;
