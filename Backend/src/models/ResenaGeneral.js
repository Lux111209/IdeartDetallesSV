import mongoose, { model } from 'mongoose';

const resenaGeneralSchema = new mongoose.Schema({
    ranking: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
        validate: {
            validator: Number.isInteger,
            message: "La calificación debe ser un número entero"
        }
    },
    titulo: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 100
    },
    tiposExperiencia: [{
        type: String,
        enum: ["excelente", "buena", "regular", "mala", "pesima", "rapido", "lento", "amigable", "dificil", "recomendado", "no_recomendado"]
    }],
    detalle: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 1000
    },
    id_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    id_producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    fechaResena: {
        type: Date,
        default: Date.now
    },
    util: {
        type: Number,
        default: 0,
        min: 0
    },
    activa: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});


export default model('ResenaGeneral', resenaGeneralSchema);