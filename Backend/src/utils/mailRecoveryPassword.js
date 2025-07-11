import nodemailer from "nodemailer";
import { config } from "../config.js";

// Configurar el transporter => ¿quien lo envia?
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: config.emailUser.user_email,
    pass: config.emailUser.user_pass,
  },
});

// ¿A quien le voy a mandar el correo?
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: '"soporte EPA" <ricardo.mayorga.ck@gmail.com>',
      to,
      subject,
      text,
      html,
    });

    return info;
  } catch (error) {
    console.log("error" + error);
  }
};

// Función para generar el HTML del correo de recuperación de contraseña
const HTMLRecoveryEmail = (message, horario, numProject) => {
  return `
      <div style="font-family: Arial, sans-serif; text-align: center; background-color: #f4f4f9; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2c3e50; font-size: 24px; margin-bottom: 20px;">Password Recovery</h1>
        <p style="font-size: 16px; color: #555; line-height: 1.5;">
          Hello, we received a request to reset your password. Use the verification code below to proceed:
        </p>
        <div style="display: inline-block; padding: 10px 20px; margin: 20px 0; font-size: 18px; font-weight: bold; color: #fff; background-color: #ff7f50; border-radius: 5px; border: 1px solid #e67e22;">
          ${code}, Asunto: ${message} el numero de pryecto a ${numProject}
        </div>
        <p style="font-size: 14px; color: #777; line-height: 1.5;">
          This code is valid for the next <strong>15 minutes</strong>. If you didn’t request this email, you can safely ignore it.
        </p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <footer style="font-size: 12px; color: #aaa;">
          If you need further assistance, please contact our support team at 
          <a href="mailto:support@example.com" style="color: #3498db; text-decoration: none;">support@example.com</a>.
        </footer>
      </div>
    `;
};

export { sendEmail, HTMLRecoveryEmail };
