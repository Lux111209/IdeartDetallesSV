import jwt from "jsonwebtoken";
import  bcrypt from "bcryptjs";
import { config } from "../config.js";
import userModel from "../models/User.js";
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

        //Falta crear el token:
     } catch (error) {
        
     }
}


