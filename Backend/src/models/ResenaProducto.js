/*
ReseñasProducts:
ranking(number)
titulo(string)
detalle(string)
id_user(objectId)
id_producto(objectId)
CompraVerificada(booleano)
img(array)
respuestaVendedor(string)
*/

import mongoose, { model } from 'mongoose';

const resenaProductoSchema = new mongoose.Schema({
    ranking: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    titulo: {
        type: String,
        required: true,
        trim: true
    },
    detalle: {
        type: String,
        required: true,
        trim: true
    },
    id_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    id_producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto',
        required: true
    },
    compraVerificada: {
        type: Boolean,
        default: false
    },
    img: {
        type: [String],
        default: []
    },
    respuestaVendedor: {
        type: String,
        trim: true
    }
});

export default model('ResenaProducto', resenaProductoSchema);
