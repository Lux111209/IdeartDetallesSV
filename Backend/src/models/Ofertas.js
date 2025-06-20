/*
Ofertas:
nombreOferta (string)
DescuentoRealizado (number)
productos (array)
creada (date)
expirada (date)
*/
import mongoose, { model } from 'mongoose';
const ofertasSchema = new mongoose.Schema({
    nombreOferta: {
        type: String,
        required: true,
        trim: true
    },
    DescuentoRealizado: {
        type: Number,
        required: true
    },
    productos: {
        type: [String],
        default: []
    },
    creada: {
        type: Date,
        default: Date.now
    },
    expirada: {
        type: Date,
        required: true
    }
});
export default model('Ofertas', ofertasSchema);