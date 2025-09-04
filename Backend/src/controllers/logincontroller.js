// controllers/loginController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import config from "../../config.js";

const loginController = {};

// Función para manejar login de admin y usuarios
loginController.login = async (req, res) => {
  const { correo, password } = req.body;

  // Validación básica backend
  if (!correo || !password)
    return res.status(400).json({ message: "Todos los campos son requeridos" });

  try {
    let userType = "user";
    let user;

    // 🔹 Login admin desde variables .env (solo acceso privado)
    if (correo === config.ADMIN.EMAIL && password === config.ADMIN.PASSWORD) {
      userType = "admin";
      user = { _id: "admin" }; // ID ficticio para admin
    } else {
      // 🔹 Login usuarios públicos desde MongoDB
      user = await User.findOne({ correo });
      if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

      // Comparar contraseña ingresada con la guardada en DB
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Generar JWT
    const token = jwt.sign(
      { id: user._id, userType },
      config.JWT.SECRET,
      { expiresIn: config.JWT.EXPIRES }
    );

    // Guardar token en cookie segura
    res.cookie("authToken", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 día
      sameSite: "Lax",
      secure: config.NODE_ENV === "production",
    });

    // Respuesta con datos del usuario
    res.status(200).json({
      message: `${userType} login successful`,
      token,
      userId: user._id,
      userType,
    });

  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ message: "Error en el servidor" });
  }
};


export default loginController;
