// models/User.js

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  correo: {
    type: String,
    required: [true, "El correo es obligatorio"],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatoria"],
    trim: true,
  },
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    trim: true,
  },
  fechaNacimiento: {
    type: String,
    required: [true, "La fecha de nacimiento es obligatoria"],
    trim: true,
  },
  favoritos: {
    type: [String],
    default: [],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true, // Agrega createdAt y updatedAt automáticamente
});

export default mongoose.model("User", userSchema);
