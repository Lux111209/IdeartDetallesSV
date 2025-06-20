import userModel from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config.js";

const loginController = {};

// Create: Login para usuarios y admins
loginController.login = async (req, res) => {
  const { email, password } = req.body;


  console.log("CONFIG ADMIN:", config.admin);

  if (!email || !password) {
    return res.status(400).json({ message: "Todos los campos son requeridos" });
  }

  try {
    let userFound;
    let userType;

 
    console.log("Datos recibidos:", { email, password });

    // Verificamos si es admin
    if (email === config.admin.email && password === config.admin.password) {
      userType = "admin";
      userFound = { _id: "admin" };
    } else {
      // Buscamos si es usuario
      userFound = await userModel.findOne({ email });

      if (userFound) {
        userType = "user";
        const isMatch = await bcrypt.compare(password, userFound.password);
        if (!isMatch) {
          return res.status(401).json({ message: "Credenciales incorrectas" });
        }
      }
    }

    if (!userFound) {
      console.log("User not found");
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Generar el token JWT
    jwt.sign(
      {
        id: userFound._id,
        userType: userType,
      },
      config.jwt.secret,
      {
        expiresIn: config.jwt.expiresIn,
      },
      (err, token) => {
        if (err) {
          console.error("Error generating token:", err);
          return res.status(500).json({ message: "Error al generar el token" });
        }

        // Enviar la respuesta con el token y el tipo de usuario
        res.cookie("token", token, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });

        res.status(200).json({
          message: `${userType} login successful`,
          token,
          userId: userFound._id,
        });
      }
    );
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
};

export default loginController;