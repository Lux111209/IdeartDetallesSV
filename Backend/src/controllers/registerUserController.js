import jwt from "jsonwebtoken";
import  bcrypt from "bcryptjs";
import { config } from "../../config.js";
import userModel from "../models/User.js";
import  nodemailer from "nodemailer";
import crypto from "crypto";



const registerUserController = {};

registerUserController.register = async (req,res) => {
    
     const { correo, password, nombre, fechaNacimiento, favoritos } = req.body;

     //validamos lo campos requeridos

     if (!correo|| !password ||!nombre || !fechaNacimiento || !favoritos) {
           return res.statu(400).json({message: "Todos lo campos sen requeridos"});
     }
     try {
        //verficamos si el usario yua existe 
        const existingUser = await userModel.findById({correo});
        if (existingUser) {
            return res.status(409).json({message:"El usuario ya existe "})
        }
        const passwordHash = await bcrypt.hash(password,10);
        const newUser = new userModel({
            correo,
            password:passwordHash,
            nombre,
            fechaNacimiento,
            favoritos
        });
        await newUser.save();

        //Generamos un codigo para verificar unico
        const verificationCode = crypto.randomBytes(3).toString("hex");
        const expiresAT= Date.now() = 2 *60*60 *1000;

       //Se crea un codigo y tiene su expiracion:
       const tokenCode = jwt.sign(
        {correo,
        verificationCode,
        expiresAT,  
        },
        config.jwt.secret,
        {expiresIn:"2h"}//el jwt expira en 2 horas
       );


       res.cookie("verificationToken",tokenCode, {
          httpOnly:true,///La cookie no sera accseisible desde java
          secure:process.env.NODE_ENV === "production",//solo se envia esa cookie si esta en produccion
          maxAge: 2 *60*60 *1000,  //Cuanto dura la cookie 

       });

       //Enviamos al correo un codigo de verficacion:
       const transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user: config.email.email, // Correo electronico
            pass:config.email.password,
        },
       });

      const mailOptions = {
  from: config.email.email,
  to: email,
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
  `
};

    //Enviamos el correo 

    transporter.sendMail(mailOptions, (err,info)=>{
      if (err) {
        console.error(err);
        return res.status(500).json({message:"Error al enviar el corre"});
      }
      console.log("Email sent:"+ info.response);
         
    });


    //Enviamos la respuesta con el codigo 

    res.status(200).json({
        message:"Usuario registrado , verifica tu email con el codigo mandado",
        token:tokenCode,
    });

     } catch (error) {
        res.status(500).json({message:"Error", error:error.message});
     }
};

 //verificacion del correo electronico al recibir el token 

 registerUserController.verifyCodeEmail = async (req,res) => {
    const{verificationCode}= req.body;
    const token = req.cookies.verificationToken; //Obtenemos el token de la cookie
   if (!token) {
    return res.status(401)
    .json({message:"No se tiene el token "});
   }

   try {
      const decoded = jwt.verify(token, config.jwt.secret);
      const {email,verificationCode:storedCode}= decoded;

      //Comparramos el codigo que se recibe con el almacenado 

      if(verificationCode!== storedCode ){
        return res.status(400).json({message:"Codigo incorrecto"})
      }

      //Marcamos el user como verificado
      const user = await userModel.findOne({correo});
      if(!client)
        {
           return res.status(404).json({message:"User no encontrado"});
      }

      //ACTUALIZAMOS EL CAMPO PARA QUE SE VERFIQUE 

      client.isVerified = true;
      await client.save();

      //Limpiamos la cookie 
      res.clearCookie("verificationCode");
      res.status(200).json({message:"El email fue verificado con exito"})
   } catch (error) {
    res.status(500)
    .json({message:"Error verificando el email", error: error.message});
   }

 };

 export default registerUserController;


