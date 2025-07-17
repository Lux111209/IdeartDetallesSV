// src/models/Ofertas.js
import mongoose from "mongoose";

const ofertasSchema = new mongoose.Schema({
  nombreOferta: {
    type: String,
    required: [true, "El nombre de la oferta es obligatorio"],
    trim: true,
    minlength: [3, "El nombre debe tener al menos 3 caracteres"],
    maxlength: [100, "El nombre no puede exceder 100 caracteres"]
  },
  
  DescuentoRealizado: {
    type: Number,
    required: [true, "El descuento es obligatorio"],
    min: [1, "El descuento mínimo es 1%"],
    max: [100, "El descuento máximo es 100%"],
    validate: {
      validator: Number.isInteger,
      message: "El descuento debe ser un número entero"
    }
  },
  
  productos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  }],
  
  expirada: {
    type: Date,
    required: [true, "La fecha de expiración es obligatoria"],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: "La fecha de expiración debe ser futura"
    }
  },
  
  activa: {
    type: Boolean,
    default: true
  },
  
  creada: {
    type: Date,
    default: Date.now
  },
  
  // Campos adicionales para estadísticas
  vecesUsada: {
    type: Number,
    default: 0,
    min: 0
  },
  
  categoria: {
    type: String,
    trim: true
  },
  
  tipoOferta: {
    type: String,
    enum: ['product', 'category', 'general'],
    default: 'product'
  },
  
  descripcion: {
    type: String,
    trim: true,
    maxlength: [500, "La descripción no puede exceder 500 caracteres"]
  }
}, {
  timestamps: true, // Agrega createdAt y updatedAt automáticamente
  collection: 'ofertas'
});

// Índices para mejorar performance
ofertasSchema.index({ activa: 1, expirada: 1 });
ofertasSchema.index({ productos: 1 });
ofertasSchema.index({ creada: -1 });
ofertasSchema.index({ DescuentoRealizado: -1 });
ofertasSchema.index({ nombreOferta: 'text' });

// Virtual para verificar si la oferta está vigente
ofertasSchema.virtual('vigente').get(function() {
  const ahora = new Date();
  return this.activa && ahora <= this.expirada;
});

// Virtual para calcular días restantes
ofertasSchema.virtual('diasRestantes').get(function() {
  const ahora = new Date();
  const diferencia = this.expirada - ahora;
  
  if (diferencia <= 0) return 0;
  
  return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
});

// Virtual para obtener el estado de la oferta
ofertasSchema.virtual('estado').get(function() {
  const ahora = new Date();
  
  if (!this.activa) return 'inactiva';
  if (ahora > this.expirada) return 'expirada';
  
  const diasRestantes = this.diasRestantes;
  if (diasRestantes <= 1) return 'por_expirar';
  if (diasRestantes <= 7) return 'proxima_a_expirar';
  
  return 'activa';
});

// Método para activar/desactivar oferta
ofertasSchema.methods.toggle = function() {
  this.activa = !this.activa;
  return this.save();
};

// Método para verificar si puede aplicarse a un producto
ofertasSchema.methods.aplicaAProducto = function(productoId) {
  return this.productos.some(id => id.toString() === productoId.toString());
};

// Método para incrementar contador de uso
ofertasSchema.methods.incrementarUso = function() {
  this.vecesUsada += 1;
  return this.save();
};

// Método estático para obtener ofertas activas
ofertasSchema.statics.obtenerActivas = function() {
  const ahora = new Date();
  return this.find({
    activa: true,
    expirada: { $gt: ahora }
  }).populate('productos');
};

// Método estático para obtener ofertas por producto
ofertasSchema.statics.obtenerPorProducto = function(productoId) {
  const ahora = new Date();
  return this.find({
    productos: productoId,
    activa: true,
    expirada: { $gt: ahora }
  }).populate('productos');
};

// Middleware pre-save para validaciones adicionales
ofertasSchema.pre('save', function(next) {
  // Asegurar que la fecha de creación no sea mayor que la de expiración
  if (this.creada && this.expirada && this.creada >= this.expirada) {
    return next(new Error('La fecha de expiración debe ser posterior a la fecha de creación'));
  }
  
  // Si la oferta está siendo activada, verificar que no haya expirado
  if (this.activa && new Date() > this.expirada) {
    return next(new Error('No se puede activar una oferta que ya ha expirado'));
  }
  
  next();
});

// Middleware pre-remove para logging
ofertasSchema.pre('findOneAndDelete', function(next) {
  console.log(`🗑️ Eliminando oferta con ID: ${this.getQuery()._id}`);
  next();
});

// Incluir virtuals en JSON
ofertasSchema.set('toJSON', { 
  virtuals: true,
  transform: function(doc, ret) {
    // Remover campos internos de MongoDB
    delete ret.__v;
    return ret;
  }
});

ofertasSchema.set('toObject', { virtuals: true });

const Ofertas = mongoose.model("Ofertas", ofertasSchema);

export default Ofertas;