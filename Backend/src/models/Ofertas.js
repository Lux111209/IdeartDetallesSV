/*
Ofertas:
nombreOferta (string)
DescuentoRealizado (number)
productos (array de ObjectIds referenciando Products)
creada (date)
expirada (date)
*/
import mongoose, { model } from 'mongoose';

const ofertasSchema = new mongoose.Schema({
    nombreOferta: {
        type: String,
        required: [true, "El nombre de la oferta es obligatorio"],
        trim: true,
        minlength: [2, "El nombre debe tener al menos 2 caracteres"],
        maxlength: [100, "El nombre no puede exceder 100 caracteres"]
    },
    DescuentoRealizado: {
        type: Number,
        required: [true, "El descuento es obligatorio"],
        min: [0, "El descuento no puede ser negativo"],
        max: [100, "El descuento no puede ser mayor a 100%"]
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
        required: [true, "La fecha de expiración es obligatoria"],
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

// Método para verificar si la oferta está vigente
ofertasSchema.methods.isActive = function() {
    return this.activa && new Date() <= this.expirada;
};

export default model('Ofertas', ofertasSchema);