import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import config from "../../config.js";

const loginController = {};

loginController.login = async (req, res) => {
  const { correo, password } = req.body;

  if (!correo || !password)
    return res.status(400).json({ message: "Todos los campos son requeridos" });

  try {
    let userType = "user";
    let user;

    if (correo === config.ADMIN.EMAIL && password === config.ADMIN.PASSWORD) {
      userType = "admin";
      user = { _id: "admin" };
    } else {
      user = await User.findOne({ correo });
      if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: user._id, userType },
      config.JWT.SECRET,
      { expiresIn: config.JWT.EXPIRES }
    );

    res.cookie("authToken", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "Lax",
      secure: config.NODE_ENV === "production",
    });

    res.status(200).json({
      message: `${userType} login successful`,
      token,
      userId: user._id,
    });

  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export default loginController;
