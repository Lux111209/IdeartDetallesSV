const logoutController = {};
import userModel from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//Create: Logout para usarios y admins

logoutController.logout = async (req,res) => {
    //Borramos la cookie

    res.clearCookie('authToken', { 
     httpOnly: true,
     path: '/',
     sameSite: 'lax',
     secure: process.env.NODE_ENV === 'production'
   });

   //Enviamos la respuesta para mostrar que logout fue exitoso
   res.status(200).json({message:"Logout con exito"});
}

export default logoutController;