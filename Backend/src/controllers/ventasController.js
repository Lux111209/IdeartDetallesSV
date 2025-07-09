import ventasModel from "../models/Ventas.js";
import mongoose from "mongoose";
import carritoModel from "../models/CarritoCompra.js";

const ventasController = {};

// Funcion para traer Todas las informaciones de ventas 

ventasController.getallVenta = async (req,res) => {
    
    try {
         const venta = await ventasModel.find()
         .populate("idCarritoCompra");
         
        res.status(200).json(venta)
    } catch (error) {
        res.status(500).json({message:"Error al mostrar los carritos",
            error:error.message,
        })
    }
}



//Funcion para traer una venta por ID

ventasController.getVentaByiD = async (req,res) => {
    try {
        const venta = await ventasModel.findById(req.params.id).populate("idCarritoCompra")


        if (!venta) {
            res.status(404).json({message:"Venta no encontrada"});
        }
        res.status(200).json(venta);
    } catch (error) {
        res.status(500).json({message:"error buscando el carrito ", error:error.message});
    }
};

//Create Venta 


ventasController.createVenta = async (req,res) => {
    const {
        idShoppingCart,
        direction,
        metodoPago,
        statusPago,
        statusTransaccion,
    }= req.body;

    try {
         //Validamos que contenga infomacion necesaria 
        if (!idShoppingCart ||!direction||!metodoPago ) {
             return res.json({message:"FALTA INFORMACION NECESARIA: (Id de carrito , la direccion y el metodo de pago)"})
        }
        //validamos que si exitas el carrito:

    } catch (error) {
        
    }
}