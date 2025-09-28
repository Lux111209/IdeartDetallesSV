import jwt from "jsonwebtoken";
import { config } from "../../config.js";

// Middleware para validar el token de authentication
export const validateAuthToken = () => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];

      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }

      const decoded = jwt.verify(token, config.JWT.SECRET);
      req.user = decoded;

      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(403).json({ message: "Token expired, please log in again" });
      }
      if (error.name === "JsonWebTokenError") {
        return res.status(403).json({ message: "Invalid token" });
      }
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };
};
