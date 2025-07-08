/*
ReseñasProducts:
ranking(number)
titulo(string)
detalle(string)
id_user(objectId)
id_producto(objectId)
compraVerificada(booleano)
img(array de strings)
respuestaVendedor(string)
fechaResena(date)
util(number)
tags(array de strings)
*/

import mongoose, { model } from 'mongoose';

const resenaProductoSchema = new mongoose.Schema({
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
    compraVerificada: {
        type: Boolean,
        default: false
    },
    img: [{
        type: String,
    }],
    respuestaVendedor: {
        type: String,
        trim: true,
        maxlength: [500, "La respuesta del vendedor no puede exceder 500 caracteres"]
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
    tags: [{
        type: String,
        trim: true,
        lowercase: true,
        enum: {
            values: ["calidad", "precio", "envio", "atencion", "recomendado", "no_recomendado", "rapido", "lento", "excelente", "bueno", "regular", "malo"],
            message: "Tag no válido"
        }
    }],
    activa: {
        type: Boolean,
        default: true
    },
    fechaRespuestaVendedor: {
        type: Date
    }
}, {
    timestamps: true
});

// Índices para mejorar consultas
resenaProductoSchema.index({ id_producto: 1, ranking: -1 });
resenaProductoSchema.index({ id_user: 1, fechaResena: -1 });
resenaProductoSchema.index({ compraVerificada: 1, ranking: -1 });
resenaProductoSchema.index({ activa: 1, fechaResena: -1 });

// Índice único para evitar múltiples reseñas del mismo usuario para el mismo producto
resenaProductoSchema.index({ id_user: 1, id_producto: 1 }, { unique: true });

// Método para marcar como útil
resenaProductoSchema.methods.marcarUtil = function() {
    this.util += 1;
    return this.save();
};

// Método para agregar respuesta del vendedor
resenaProductoSchema.methods.agregarRespuestaVendedor = function(respuesta) {
    this.respuestaVendedor = respuesta;
    this.fechaRespuestaVendedor = new Date();
    return this.save();
};

// Método para agregar tags
resenaProductoSchema.methods.agregarTag = function(tag) {
    if (!this.tags.includes(tag)) {
        this.tags.push(tag);
    }
};

// Método para remover tags
resenaProductoSchema.methods.removerTag = function(tag) {
    this.tags = this.tags.filter(t => t !== tag);
};

// Virtual para verificar si tiene respuesta del vendedor
resenaProductoSchema.virtual('tieneRespuestaVendedor').get(function() {
    return !!(this.respuestaVendedor && this.respuestaVendedor.trim().length > 0);
});

// Incluir virtuals en JSON
resenaProductoSchema.set('toJSON', { virtuals: true });

export default model('ResenaProducto', resenaProductoSchema);