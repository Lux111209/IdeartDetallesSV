/*
ReseñaGeneral:
ranking(number)
titulo(string)
tiposExperiencia(array de strings)
detalle(string)
id_user(objectId)
id_producto(objectId)
fechaResena(date)
util(number)
*/
import mongoose, { model } from 'mongoose';

const resenaGeneralSchema = new mongoose.Schema({
    ranking: {
        type: Number,
        required: [true, "La calificación es obligatoria"],
        min: [1, "La calificación mínima es 1"],
        max: [5, "La calificación máxima es 5"],
        validate: {
            validator: Number.isInteger,
            message: "La calificación debe ser un número entero"
        }
    },
    titulo: {
        type: String,
        required: [true, "El título es obligatorio"],
        trim: true,
        minlength: [5, "El título debe tener al menos 5 caracteres"],
        maxlength: [100, "El título no puede exceder 100 caracteres"]
    },
    tiposExperiencia: [{
        type: String,
        required: true,
        trim: true,
        enum: {
            values: ["excelente", "buena", "regular", "mala", "pesima", "rapido", "lento", "amigable", "dificil", "recomendado", "no_recomendado"],
            message: "Tipo de experiencia no válido"
        }
    }],
    detalle: {
        type: String,
        required: [true, "El detalle es obligatorio"],
        trim: true,
        minlength: [10, "El detalle debe tener al menos 10 caracteres"],
        maxlength: [1000, "El detalle no puede exceder 1000 caracteres"]
    },
    id_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "El ID del usuario es obligatorio"]
    },
    id_producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, "El ID del producto es obligatorio"]
    },
    fechaResena: {
        type: Date,
        default: Date.now
    },
    util: {
        type: Number,
        default: 0,
        min: [0, "La utilidad no puede ser negativa"]
    },
    activa: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Índices para mejorar consultas
resenaGeneralSchema.index({ id_producto: 1, ranking: -1 });
resenaGeneralSchema.index({ id_user: 1, fechaResena: -1 });
resenaGeneralSchema.index({ activa: 1, fechaResena: -1 });

// Índice único para evitar múltiples reseñas del mismo usuario para el mismo producto
resenaGeneralSchema.index({ id_user: 1, id_producto: 1 }, { unique: true });

// Método para marcar como útil
resenaGeneralSchema.methods.marcarUtil = function() {
    this.util += 1;
    return this.save();
};

// Método para obtener resumen de experiencia
resenaGeneralSchema.methods.getResumenExperiencia = function() {
    return {
        calificacion: this.ranking,
        experiencias: this.tiposExperiencia,
        utilidad: this.util
    };
};

export default model('ResenaGeneral', resenaGeneralSchema);