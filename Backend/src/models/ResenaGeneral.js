/*
ReseñaGeneral:
ranking(number)
titulo(string)
tipoExperencia(string)
detalle(string)
id_user(objectId)
id_producto(objectId)
*/
import mongoose, { model } from 'mongoose';
const resenaGeneralSchema = new mongoose.Schema({
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
    tipoExperiencia: {
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
    }
});
export default model('ResenaGeneral', resenaGeneralSchema);