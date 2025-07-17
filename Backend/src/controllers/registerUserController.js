import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { config } from "../../config.js";
import userModel from "../models/User.js";
import nodemailer from "nodemailer";
import crypto from "crypto";

const registerUserController = {};

//Controlador para registrar un nuevo usuario
registerUserController.register = async (req, res) => {
  const { correo, password, nombre, fechaNacimiento, favoritos } = req.body;

  // Validar que todos los campos estén presentes
  if (!correo || !password || !nombre || !fechaNacimiento || !favoritos) {
    return res.status(400).json({ message: "Todos los campos son requeridos" });
  }

  try {
    // Verificar si ya existe un usuario con ese correo
    const existingUser = await userModel.findOne({ correo });
    if (existingUser) {
      return res.status(409).json({ message: "El usuario ya existe" });
    }

    // Hashear la contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const newUser = new userModel({
      correo,
      password: passwordHash,
      nombre,
      fechaNacimiento,
      favoritos,
    });

    await newUser.save();

    // Generar código de verificación único y su expiración
    const verificationCode = crypto.randomBytes(3).toString("hex");
    const expiresAT = Date.now() + 2 * 60 * 60 * 1000; // 2 horas en milisegundos

    // 🪙 Crear token JWT con el código y correo
    const tokenCode = jwt.sign(
      { correo, verificationCode, expiresAT },
      config.JWT.SECRET, // <-- Corregido aquí
      { expiresIn: "2h" }
    );

    // Guardar token en cookie (HTTP Only)
    res.cookie("verificationToken", tokenCode, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 2 * 60 * 60 * 1000,
    });

    // 📧 Configurar y enviar correo con el código
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.EMAIL.USER,      // <-- Corregido aquí
        pass: config.EMAIL.PASSWORD,  // <-- Corregido aquí
      },
    });

    const mailOptions = {
      from: config.EMAIL.USER,        // <-- Corregido aquí
      to: correo, 
      subject: "Verifica tu correo electrónico",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #e91e63;">¡Verifica tu cuenta!</h2>
          <p style="font-size: 16px;">Para continuar con el proceso, utiliza el siguiente código de verificación:</p>
          <div style="background-color: #e8f5e9; border: 2px dashed #4caf50; color: #4caf50; padding: 15px; font-size: 24px; font-weight: bold; text-align: center; border-radius: 8px; margin: 20px 0;">
            ${verificationCode}
          </div>
          <p style="font-size: 14px; color: #777;">Este código expirará en <strong>2 horas</strong>.</p>
          <p style="font-size: 14px; color: #777;">Si no solicitaste este registro, por favor ignora este mensaje.</p>
          <p style="font-size: 14px; color: #e91e63; margin-top: 30px;">Con cariño,<br><strong>El equipo de DreamCore</strong></p>
        </div>
      `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error al enviar el correo:", err);
        return res.status(500).json({ message: "Error al enviar el correo" });
      }
      console.log("Email enviado:", info.response);
    });

    // Devolver respuesta exitosa
    res.status(200).json({
      message: "Usuario registrado, verifica tu email con el código enviado",
      token: tokenCode,
    });

  } catch (error) {
    res.status(500).json({ message: "Error interno", error: error.message });
  }
};

//  Controlador para verificar código de verificación enviado al correo
registerUserController.verifyCodeEmail = async (req, res) => {
  const { verificationCode } = req.body;
  const token = req.cookies.verificationToken;

  //  Si no hay token, no se puede verificar
  if (!token) {
    return res.status(401).json({ message: "No se tiene el token" });
  }

  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(token, config.JWT.SECRET); // <-- Corregido aquí
    const { correo, verificationCode: storedCode } = decoded;

    //  Comparar el código ingresado con el que está en el token
    if (verificationCode !== storedCode) {
      return res.status(400).json({ message: "Código incorrecto" });
    }

    // Buscar usuario por correo y marcarlo como verificado
    const user = await userModel.findOne({ correo });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    user.isVerified = true;
    await user.save();

    // Limpiar la cookie del token
    res.clearCookie("verificationToken");

    res.status(200).json({ message: "El email fue verificado con éxito" });

  } catch (error) {
    res.status(500).json({
      message: "Error verificando el email",
      error: error.message,
    });
  }
};

export default registerUserController;