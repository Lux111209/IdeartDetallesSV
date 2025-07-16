import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "../../config.js";
import userModel from "../models/User.js";
import nodemailer from "nodemailer";
import crypto from "crypto";

const registerUserController = {};

registerUserController.register = async (req, res) => {
  const { correo, password, nombre, fechaNacimiento, favoritos } = req.body;

  // Validamos los campos requeridos
  if (!correo || !password || !nombre || !fechaNacimiento || !favoritos) {
    return res.status(400).json({ message: "Todos los campos son requeridos" });
  }

  try {
    // Verificamos si el usuario ya existe
    const existingUser = await userModel.findOne({ correo });
    if (existingUser) {
      return res.status(409).json({ message: "El usuario ya existe" });
    }

    // Hasheamos la contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Creamos el nuevo usuario
    const newUser = new userModel({
      correo,
      password: passwordHash,
      nombre,
      fechaNacimiento,
      favoritos,
    });

    await newUser.save();

    // Generamos un código de verificación único
    const verificationCode = crypto.randomBytes(3).toString("hex");
    const expiresAt = Date.now() + 2 * 60 * 60 * 1000; // 2 horas en ms

    // Creamos un token JWT con el código y expiración
    const tokenCode = jwt.sign(
      {
        correo,
        verificationCode,
        expiresAt,
      },
      config.JWT.SECRET,
      { expiresIn: "2h" } // El JWT expira en 2 horas
    );

    // Enviamos el token en una cookie HTTP only
    res.cookie("verificationToken", tokenCode, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 2 * 60 * 60 * 1000, // 2 horas
    });

    // Configuramos el transporte para enviar emails
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.EMAIL.USER,
        pass: config.EMAIL.PASSWORD,
      },
    });

    // Opciones del correo
    const mailOptions = {
      from: config.EMAIL.USER,
      to: correo,
      subject: "Verifica tu correo electrónico",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #e91e63;">¡Verifica tu cuenta!</h2>
          <p style="font-size: 16px;">
            Para continuar con el proceso, utiliza el siguiente código de verificación:
          </p>
          <div style="background-color: #e8f5e9; border: 2px dashed #4caf50; color: #4caf50; padding: 15px; font-size: 24px; font-weight: bold; text-align: center; border-radius: 8px; margin: 20px 0;">
            ${verificationCode}
          </div>
          <p style="font-size: 14px; color: #777;">
            Este código expirará en <strong>2 horas</strong>.
          </p>
          <p style="font-size: 14px; color: #777;">
            Si no solicitaste este registro, por favor ignora este mensaje.
          </p>
          <p style="font-size: 14px; color: #e91e63; margin-top: 30px;">
            Con cariño,<br><strong>El equipo de DreamCore</strong>
          </p>
        </div>
      `,
    };

    // Enviamos el correo
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(err);
        // No respondemos aquí para evitar enviar dos veces respuesta
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    // Respondemos con éxito
    res.status(200).json({
      message: "Usuario registrado, verifica tu email con el código enviado",
      token: tokenCode,
    });
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};

// Verificación del correo electrónico al recibir el token
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

    user.isVerified = true; // Asegúrate que tu modelo tenga este campo
    await user.save();

    res.clearCookie("verificationToken");
    res.status(200).json({ message: "El email fue verificado con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error verificando el email", error: error.message });
  }
};

export default registerUserController;
