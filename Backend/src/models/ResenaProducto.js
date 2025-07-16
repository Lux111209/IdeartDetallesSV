import mongoose, { model } from 'mongoose';

const resenaProductoSchema = new mongoose.Schema({
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
    compraVerificada: {
        type: Boolean,
        default: false
    },
    img: [String],
    respuestaVendedor: String,
    fechaResena: {
        type: Date,
        default: Date.now
    },
    util: {
        type: Number,
        default: 0
    },
    tags: [String],
    activa: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Índice único para evitar múltiples reseñas del mismo usuario para el mismo producto
resenaProductoSchema.index({ id_user: 1, id_producto: 1 }, { unique: true });

export default model('ResenaProducto', resenaProductoSchema);