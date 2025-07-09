/*
Carrito de Compra:
Productos
[id_producto
cantidad,
subtotal]<
Id_User(objectId)
total(doublé)
ofertaAplicada
descuento
totalconDescuento*/ 

import { Schema,model} from "mongoose";


const CarritoComprasSchema = new Schema({
  products: [
    {
      idProducts: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "El id del producto es obligatorio"]
      },
      cantidad: {
        type: Number,
        required: [true, "La cantidad es obligatoria"],
        min: [1, "La cantidad debe ser mayor que 0"]
      }
    }
  ],
  idUser: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "El id del usuario es obligatorio"]
  },
  Ofertas: [
    {
      idOfertas: {
        type: Schema.Types.ObjectId,
        ref: "Ofertas",
        required: [true, "El id de la oferta es obligatorio"]
      }
    }
  ],
  total: {
    type: Number,
    required: true,
    min: [0, "El total no puede ser negativo"]
  }
});
export default model('CarritoCompra',CarritoComprasSchema);