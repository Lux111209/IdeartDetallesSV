import nodemailer from "nodemailer";
import { config } from "../../config.js";

// Configurar el transporter (quién envía)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: config.EMAIL.USER,
    pass: config.EMAIL.PASSWORD,
  },
});

// Enviar correo
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Ideart Detalles" <${config.EMAIL.USER}>`,
      to,
      subject,
      text,
      html,
    });

    return info;
  } catch (error) {
    console.error("Error al enviar el correo:", error);
  }
};

// HTML personalizado para el correo de recuperación con texto en verde
const HTMLRecoveryEmail = (code) => {
  return `
    <div style="font-family: Arial, sans-serif; text-align: center; background-color: #f4f4f9; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #A93A60; font-size: 24px; margin-bottom: 20px;">Recuperación de Contraseña</h1>
      
      <p style="font-size: 16px; color: #A93A60; line-height: 1.5;">
        Hola, hemos recibido una solicitud para restablecer tu contraseña. Usa el siguiente código para continuar:
      </p>

      <div style="display: inline-block; padding: 10px 20px; margin: 20px 0; font-size: 18px; font-weight: bold; color: #fff; background-color: #A93A60; border-radius: 5px; border: 1px solid #922E53;">
        ${code}
      </div>

      <p style="font-size: 14px; color: #A93A60; line-height: 1.5;">
        Este código es válido durante los próximos <strong>15 minutos</strong>. Si tú no solicitaste este cambio, puedes ignorar este correo.
      </p>

      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">

      <footer style="font-size: 12px; color: #A93A60;">
        Este correo fue enviado por el equipo de <strong>IdeartDetalles</strong>.<br>
        ¿Necesitas ayuda? Escríbenos a 
        <a href="mailto:soporte@ideartdetalles.com" style="color: #A93A60; text-decoration: none;">soporte@ideartdetalles.com</a>
      </footer>
    </div>
  `;
};


export { sendEmail, HTMLRecoveryEmail };
