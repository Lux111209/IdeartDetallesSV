/*
Proveedores:
nombre(string)
productobrindado(string)
numero (number)
correo (string)
imgProvedor (string)
*/ 

import mongoose, { model } from 'mongoose';
const provedoresSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    productobrindado: {
        type: String,
        required: true,
        trim: true
    },
    numero: {
        type: Number,
        required: true
    },
    correo: {
        type: String,
        required: true,
        trim: true
    },
    imgProvedor: {
        type: String,
        required: true,
        trim: true
    }
});
export default model('Provedores', provedoresSchema);