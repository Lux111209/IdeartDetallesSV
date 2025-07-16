import mongoose, { model } from 'mongoose';

const provedoresSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100
    },
    productosBrindados: [{
        type: String,
        required: true,
        trim: true
    }],
    numero: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function(v) {
                return /^[\d\-\+\(\)\s]+$/.test(v);
            },
            message: "Número de teléfono no válido"
        }
    },
    correo: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: "Correo electrónico no válido"
        }
    },
    imgProvedor: {
        type: String,
        trim: true
    },
    direccion: {
        type: String,
        trim: true,
        maxlength: 200
    },
    activo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Índice único para el correo
provedoresSchema.index({ correo: 1 }, { unique: true });

export default model('Provedores', provedoresSchema);