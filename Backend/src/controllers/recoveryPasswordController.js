import jsonwebtoken from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import userModel from "../models/User.js"; 
import { sendEmail, HTMLRecoveryEmail } from "../utils/mailRecoveryPassword.js";
import { config } from "../../config.js";



const recoveryPasswordController = {};

//solicitar codigo
recoveryPasswordController.requestCode = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userModel.findOne({ correo: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const code = Math.floor(10000 + Math.random() * 90000).toString();

   console.log("JWT SECRET:", config.JWT.SECRET);
    const token = jsonwebtoken.sign(
      { email, code, verified: false },
      config.JWT.SECRET,
      { expiresIn: "20m" }
    );

    res.cookie("tokenRecoveryCode", token, {
      httpOnly: true,
      maxAge: 20 * 60 * 1000,
    });

    await sendEmail(
      email,
      "Password recovery code",
      `Your verification code is: ${code}`,
      HTMLRecoveryEmail(code)
    );

    res.status(200).json({ message: "Verification code sent" });
  } catch (error) {
    console.error("requestCode →", error);
    res.status(500).json({ message: "Server error" });
  }
};

//Verificamos el codigo que se envio al correo
recoveryPasswordController.verifyCode = async (req, res) => {
  const { code } = req.body;

  try {
    const token = req.cookies.tokenRecoveryCode;
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jsonwebtoken.verify(token, config.JWT.SECRET);

    if (decoded.code !== code) {
      return res.status(400).json({ message: "Invalid code" });
    }

    // Extraemos solo los campos necesarios para evitar conflicto con exp
    const { email, code: savedCode } = decoded;

    const newToken = jsonwebtoken.sign(
      { email, code: savedCode, verified: true },
      config.JWT.SECRET,
      { expiresIn: "20m" }
    );

    res.cookie("tokenRecoveryCode", newToken, {
      httpOnly: true,
      maxAge: 20 * 60 * 1000,
    });

    res.status(200).json({ message: "Code verified successfully" });
  } catch (error) {
    console.error("verifyCode →", error);
    res.status(500).json({ message: "Server error" });
  }
};

//Cambiamos la password
recoveryPasswordController.newPassword = async (req, res) => {
  const { newPassword } = req.body;

  try {
    const token = req.cookies.tokenRecoveryCode;
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jsonwebtoken.verify(token, config.JWT.SECRET);

    if (!decoded.verified) {
      return res.status(400).json({ message: "Code not verified" });
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    await userModel.findOneAndUpdate(
     { correo: decoded.email },
     { password: hashedPassword },
      { new: true }
    );



    res.clearCookie("tokenRecoveryCode");
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("newPassword →", error);
    res.status(500).json({ message: "Server error" });
  }
};

export default recoveryPasswordController;
