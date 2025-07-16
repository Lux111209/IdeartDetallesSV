/*
User:
correo(string)
password(string)
nombre(string)
fechaNacimiento(string)
favoritos(array)
*/
import mongoose, { model } from 'mongoose';

const userSchema = new mongoose.Schema({
  correo: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  fechaNacimiento: {
    type: String,
    required: true,
    trim: true
  },
  favoritos: {
    type: [String],
    default: []
  },
  isVerified: {
    type: Boolean,
    default: false
  }
});

export default model('User', userSchema);
