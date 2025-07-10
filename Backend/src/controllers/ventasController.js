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
        const carrito = await carritoModel.findById(idShoppingCart);
        if (!carrito) {
            return res.status(404).json({message:"El carrito de compras no fue encontrado"})
        }
        

        //Creamos la venta:

        const newVenta = new ventasModel({
            idShoppingCart,
            direction,
            metodoPago,
            statusPago,
            statusTransaccion
        });

        await newVenta.save();

        res.status(201).json({
            message:"Venta se creo con exito"
        });



    } catch (error) {
        res.status(400).json({message:"Error al crear la venta", error: error.message});

    }
};

//Funcion para actualizar una venta por Id 

ventasController.updateVenta = async (req,res) => {
    const {
        idShoppingCart,
        direction,
        metodoPago,
        statusPago,
        statusTransaccion,
    }= req.body;

    try {
         const update ={
        idShoppingCart,
        direction,
        metodoPago,
        statusPago,
        statusTransaccion,
    };

        const updateVentas = await ventasModel.findByIdAndUpdate(req.params.id,update, {new:true})
        .populate("idCarritoCompra");

        if (!updateVentas) {
            return res.status(404).json({message:"Venta no encontrada"})
        }

        res.status(200).json({message:"Venta actualizada con exito"});

    } catch (error) {
        res.status(400).json({message:"Error actualizando la venta", error:error.message});
    }
};

ventasController.deleteVenta = async (req,res) => {
        
try {
    
    const deleteVenta = await ventasModel.findByIdAndDelete(req.paramas.id);
    if (!deleteVenta) {
        return res.status(404).json({message:"Ventan no encontrada"})
    }
    res.status(200).json({message:"venta eliminada con exito"});

} catch (error) {

    res.status(400).json({message:"Error al eliminar el carrito",error: error.message});
}

};


export default ventasController;
