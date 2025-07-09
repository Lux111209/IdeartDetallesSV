/*Venta(YAAAAAAAAAAAAAAa):
Id_Shoppincart(objectId)
dirección(string)
Método de pago(string)
statusTransaccion(string)
statusPago(string) */


import {Schema, model } from "mongoose";

const VentasSchema = new Schema({
 idShoppingCart: {
    type: Schema.Types.ObjectId,
    ref: "CarritoCompra", 
    required: true
  },
direction:{
    type: String,
    required:[true,"La dirreccion debe de ser totalmente obligatoria "],
    minlength: [10, "La dirección debe tener al menos 10 caracteres"],
    maxlength: [200, "La dirección no puede exceder los 200 caracteres"]
},
metodoPago: {
    type: String,
    required: [true, "El método de pago es obligatorio"]
  }
, 
statusPago:{
    type:String,
    enum: ["pendiente", "completado", "fallido"],
    default: "pendiente",
},
statusTransaccion:{
    type:String,
    enum: ["procesando", "completada", "cancelada"],
    default: "procesando"
   
}
},
{
    timestamps:true
}
);

export default model("Ventas", VentasSchema);