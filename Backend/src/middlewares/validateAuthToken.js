import jwt, { decode } from 'jsonwebtoken';
import { config } from '../../config.js';

// Middleware para validar el token de authentication

export const validateAuthToken = (allowedTypes =[]) =>{
 return (req,res,next) =>{
try {
    //intenta obtener el token del header de info
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    //Si no hay token en el header, cookies
    if (!token) {
        return res.status(401).json({message:"No token provided"})
    }

    const decoded = jwt.verify(token, config.JWT.SECRET);
    req.user = decoded;

    //verificamos si el tipo de usuario tiene acceso 

    if (allowedTypes.length > 0 && !allowedTypes.includes(decoded.userType)) {
        return res.status(403).json({message:"Access denied: insufficient permissions"});
        
    }
   
    next();
} catch (error) {
    if (error.name === "TokenExpiredError") {
        return res.status(403).json({message:"Token expired , please log in again"});
    }
    if (error.name === "JsonWebTokenError") {
        return res.status(403).json({message:"Invavlid token "});
    }
    return res.status(500).json({message: "Internal server error",error:error.message})
    }
   }
};

