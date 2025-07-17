import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
<<<<<<< HEAD
import { config } from "../../config.js";
=======
import config from "../../config.js";
>>>>>>> master
import userModel from "../models/User.js";
import nodemailer from "nodemailer";
import crypto from "crypto";

const registerUserController = {};

<<<<<<< HEAD
//Controlador para registrar un nuevo usuario
registerUserController.register = async (req, res) => {
  const { correo, password, nombre, fechaNacimiento, favoritos } = req.body;

  // Validar que todos los campos estén presentes
=======
registerUserController.register = async (req, res) => {
  const { correo, password, nombre, fechaNacimiento, favoritos } = req.body;

  // Validamos los campos requeridos
>>>>>>> master
  if (!correo || !password || !nombre || !fechaNacimiento || !favoritos) {
    return res.status(400).json({ message: "Todos los campos son requeridos" });
  }

  try {
<<<<<<< HEAD
    // Verificar si ya existe un usuario con ese correo
=======
    // Verificamos si el usuario ya existe
>>>>>>> master
    const existingUser = await userModel.findOne({ correo });
    if (existingUser) {
      return res.status(409).json({ message: "El usuario ya existe" });
    }

<<<<<<< HEAD
    // Hashear la contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
=======
    // Hasheamos la contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Creamos el nuevo usuario
>>>>>>> master
    const newUser = new userModel({
      correo,
      password: passwordHash,
      nombre,
      fechaNacimiento,
      favoritos,
<<<<<<< HEAD
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
=======
      isVerified: false, // Asegúrate que tu modelo tenga este campo
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
>>>>>>> master
    res.status(200).json({
      message: "Usuario registrado, verifica tu email con el código enviado",
      token: tokenCode,
    });
<<<<<<< HEAD

  } catch (error) {
    res.status(500).json({ message: "Error interno", error: error.message });
  }
};

//  Controlador para verificar código de verificación enviado al correo
=======
  } catch (error) {
    res.status(500).json({ message: "Error", error: error.message });
  }
};

// Verificación del correo electrónico al recibir el token
>>>>>>> master
registerUserController.verifyCodeEmail = async (req, res) => {
  const { verificationCode } = req.body;
  const token = req.cookies.verificationToken;

<<<<<<< HEAD
  //  Si no hay token, no se puede verificar
=======
>>>>>>> master
  if (!token) {
    return res.status(401).json({ message: "No se tiene el token" });
  }

  try {
<<<<<<< HEAD
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
=======
    const decoded = jwt.verify(token, config.JWT.SECRET);
    const { correo, verificationCode: storedCode, expiresAt } = decoded;

    // Verifica expiración del código
    if (Date.now() > expiresAt) {
      return res.status(400).json({ message: "El código ha expirado, solicita uno nuevo." });
    }

    // Normaliza la comparación del código
    if (
      verificationCode.trim().toLowerCase() !== storedCode.trim().toLowerCase()
    ) {
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
>>>>>>> master
  }
};

export default registerUserController;