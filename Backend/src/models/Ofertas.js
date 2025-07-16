import mongoose, { model } from 'mongoose';

const ofertasSchema = new mongoose.Schema({
    nombreOferta: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100
    },
    DescuentoRealizado: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    productos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    }],
    creada: {
        type: Date,
        default: Date.now
    },
    expirada: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                return value > this.creada || value > new Date();
            },
            message: "La fecha de expiración debe ser posterior a la fecha de creación"
        }
    },
    activa: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Índice para mejorar consultas por fecha de expiración
ofertasSchema.index({ expirada: 1, activa: 1 });

export default model('Ofertas', ofertasSchema);