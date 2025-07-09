/*
Proveedores:
nombre(string)
productosBrindados(array de strings)
numero (number)
correo (string)
imgProvedor (string)
direccion (string)
activo (boolean)
*/ 

import mongoose, { model } from 'mongoose';

const provedoresSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, "El nombre del proveedor es obligatorio"],
        trim: true,
        minlength: [2, "El nombre debe tener al menos 2 caracteres"],
        maxlength: [100, "El nombre no puede exceder 100 caracteres"]
    },
    productosBrindados: [{
        type: String,
        required: true,
        trim: true,
        minlength: [2, "El nombre del producto debe tener al menos 2 caracteres"]
    }],
    numero: {
        type: String,
        required: [true, "El número de teléfono es obligatorio"],
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
        required: [true, "El correo electrónico es obligatorio"],
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
        required: false,
        trim: true,
    },
    direccion: {
        type: String,
        required: false,
        trim: true,
        maxlength: [200, "La dirección no puede exceder 200 caracteres"]
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

// Método para agregar un producto
provedoresSchema.methods.agregarProducto = function(producto) {
    if (!this.productosBrindados.includes(producto)) {
        this.productosBrindados.push(producto);
    }
};

// Método para remover un producto
provedoresSchema.methods.removerProducto = function(producto) {
    this.productosBrindados = this.productosBrindados.filter(p => p !== producto);
};

export default model('Provedores', provedoresSchema);