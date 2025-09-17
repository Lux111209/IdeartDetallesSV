import { Schema, model } from "mongoose";

const VentasSchema = new Schema({
  idShoppingCart: {
    type: Schema.Types.ObjectId,
    ref: "CarritoCompra",
    required: true,
  },
  direccion: {
    type: String,
    required: [true, "La dirección debe de ser totalmente obligatoria"],
    minlength: [10, "La dirección debe tener al menos 10 caracteres"],
    maxlength: [200, "La dirección no puede exceder los 200 caracteres"],
  },
  metodoPago: {
    type: String,
    required: [true, "El método de pago es obligatorio"],
  },
  statusPago: {
    type: String,
    enum: ["pendiente", "completado", "fallido"],
    default: "pendiente",
  },
  statusTransaccion: {
    type: String,
    enum: ["procesando", "completada", "cancelada"],
    default: "procesando",
  },
  
  idTransaccion: {
    type: String,
    unique: true,
    required: true,
  },
  monto: {
    type: Number,
    required: true,
  },
  nombre: String,
  apellido: String,
  email: String,
  telefono: String,
  ciudad: String,
  codigoPostal: String,
  idPais: String,
  idRegion: String,
  rawResponse: {
    type: Object, 
  },
}, {
  timestamps: true
});

export default model("Ventas", VentasSchema);
