import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { config } from "../../config.js";
import userModel from "../models/User.js";
import nodemailer from "nodemailer";
import crypto from "crypto";

const registerUserController = {};

// Controlador para registrar un nuevo usuario
registerUserController.register = async (req, res) => {
  const { correo, password, nombre, fechaNacimiento, favoritos } = req.body;

  if (!correo || !password || !nombre || !fechaNacimiento || !favoritos) {
    return res.status(400).json({ message: "Todos los campos son requeridos" });
  }

  try {
    const existingUser = await userModel.findOne({ correo });
    if (existingUser) {
      return res.status(409).json({ message: "El usuario ya existe" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      correo,
      password: passwordHash,
      nombre,
      fechaNacimiento,
      favoritos,
    });

    await newUser.save();

    const verificationCode = crypto.randomBytes(3).toString("hex");
    const expiresAT = Date.now() + 2 * 60 * 60 * 1000;

    const tokenCode = jwt.sign(
      { correo, verificationCode, expiresAT },
      config.JWT.SECRET,
      { expiresIn: "2h" }
    );

    res.cookie("verificationToken", tokenCode, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 2 * 60 * 60 * 1000,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.EMAIL.USER,
        pass: config.EMAIL.PASSWORD,
      },
    });

    const mailOptions = {
      from: config.EMAIL.USER,
      to: correo,
      subject: "Verifica tu correo electrónico",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #e91e63;">¡Verifica tu cuenta!</h2>
          <p>Utiliza el siguiente código de verificación para continuar:</p>
          <div style="background:#e8f5e9; border: 2px dashed #4caf50; color:#4caf50; padding:15px; font-size:24px; font-weight:bold; text-align:center; border-radius:8px; margin:20px 0;">
            ${verificationCode}
          </div>
          <p>Este código expirará en <strong>2 horas</strong>.</p>
          <p>Si no solicitaste este registro, ignora este mensaje.</p>
          <p style="color:#e91e63; margin-top:30px;">Con cariño,<br><strong>El equipo de DreamCore</strong></p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Usuario registrado, verifica tu email con el código enviado",
      token: tokenCode,
    });

  } catch (error) {
    console.error("Error al registrar usuario o enviar correo:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Error interno", error: error.message });
    }
  }
};

// Controlador para verificar código de verificación enviado al correo
registerUserController.verifyCodeEmail = async (req, res) => {
  const { verificationCode } = req.body;
  const token = req.cookies.verificationToken;

  if (!token) {
    return res.status(401).json({ message: "No se tiene el token" });
  }

  try {
    const decoded = jwt.verify(token, config.JWT.SECRET);
    const { correo, verificationCode: storedCode } = decoded;

    if (verificationCode !== storedCode) {
      return res.status(400).json({ message: "Código incorrecto" });
    }

    const user = await userModel.findOne({ correo });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    user.isVerified = true;
    await user.save();

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
