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





import {Model, Schema,model} from "mongoose";
import Products from "./Products";

const CarritoComprasSchema = new Schema(
{
products:[
{
    idProducts:{
        type:Schema.Types.ObjectId,
        refs:"Products",
        required:[true,"El id del producto es obligatorio"]

    },
    stock:{
      type:Number,
       required: [true, "Stock is required"],
      min: [0, "Stock can't be negative"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be greater than or equal to 0"],
    },
},
],
idUser:{
    type:Schema.Types.ObjectId,
    refs:"User",
    required:[true,"El id del usuario es obligatorio"]
},
Ofertas:[
    {
        idOfertas:{
            type:Schema.Types.ObjectId,
            refs:"Ofertas",
            required:[true,"El id de la oferta es obligatorio"]
        },
         nombreOferta: {
        type: String,
        required: true,
        trim: true
    },
    DescuentoRealizado: {
        type: Number,
        required: true
    },
    },
],
total:{
type:Number,
required:true,
min:[0,"El total no puede ser negativo"]
},
}
);
export default model('CarritoCompra',CarritoComprasSchema);