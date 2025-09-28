import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { config } from "../../config.js";

const loginController = {
  login: async (req, res) => {
    try {
      const { correo, password } = req.body;

      const user = await User.findOne({ correo });
      if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) return res.status(401).json({ message: "Contraseña incorrecta" });

      const token = jwt.sign(
        { id: user._id, correo: user.correo },
        config.JWT.SECRET,
        { expiresIn: "1h" }
      );

      res.json({ 
        token, 
        userId: user._id, 
        userType: "cliente" // puedes personalizarlo si quieres roles
      });
    } catch (error) {
      res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
  }
};

export default loginController;
