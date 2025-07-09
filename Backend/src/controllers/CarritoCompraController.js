import cartModel from '../models/CarritoCompra.js';
import { config } from "../../config.js";
import mongoose from 'mongoose';  


const CarritoCompraController ={};


//Funcion para traer la info de carrito:
CarritoCompraController.getCarritoCompra = async (req, res) => {
  try {
    const carrito = await cartModel.find()
      .populate("products.idProducts", "stock price")
      .populate("idUser")
      .populate("Ofertas.idOfertas", "nombreOferta DescuentoRealizado");

    res.status(200).json(carrito);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching carrito",
      error: error.message,
    });
  }
};

//Funcion para ver ID:

CarritoCompraController.getCarritoCompraById = async (req, res) => {
  try {
    const carrito = await cartModel.findById(req.params.id)
      .populate("products.idProducts", "stock price")
      .populate("idUser")
      .populate("Ofertas.idOfertas", "nombreOferta DescuentoRealizado");

    if (!carrito) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    res.status(200).json(carrito);
  } catch (error) {
    res.status(400).json({ message: "error buscando el carrito", error: error.message });
  }
};////



///Funcion para crear un carrito

CarritoCompraController.createCarritoCompra = async (req, res) => {
  const {
    products,
    idUser,
    Ofertas,
    total,
  } = req.body;

  try {
    // Validar que 'products' sea un array y que cada producto tenga idProducts y cantidad válida
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "El array de productos es requerido y no puede estar vacío." });
    }

    const productosValidos = products.every(p =>
      p.idProducts &&
      mongoose.Types.ObjectId.isValid(p.idProducts) &&
      typeof p.cantidad === 'number' &&
      p.cantidad > 0
    );

    if (!productosValidos) {
      return res.status(400).json({ message: "Cada producto debe tener un ID válido y una cantidad mayor a 0." });
    }

    // Validar Ofertas si existen
    if (Ofertas && (!Array.isArray(Ofertas) || !Ofertas.every(o => mongoose.Types.ObjectId.isValid(o.idOfertas)))) {
      return res.status(400).json({ message: "Las ofertas deben contener IDs válidos." });
    }

    // Validar total
    if (typeof total !== 'number' || total < 0) {
      return res.status(400).json({ message: "El total debe ser un número positivo." });
    }

    // Crear nuevo carrito
    const newCarrito = new cartModel({
      products,
      idUser,
      Ofertas,
      total
    });

    await newCarrito.save();
    res.status(201).json({ message: "Carrito creado con éxito" });

  } catch (error) {
    res.status(400).json({ message: "Error creando el carrito", error: error.message });
  }
};




//fUNCION PARA ACTUALIZAR  
CarritoCompraController.updateCarrito = async (req,res) => {
  const {products,
        idUser,
        Ofertas,
        total,} = req.body;
        

    try {
      const update = {products,
        idUser,
        Ofertas,
        total };
      
      const updateCarrito = await cartModel.findByIdAndUpdate(req.params.id, update, {new:true})
      .populate("products.idProducts","stock price")
      .populate("idUser")
      .populate("Ofertas.idOfertas", "nombreOferta DescuentoRealizado");

      if (!updateCarrito) {
        return res.status(404).json({message: "Carrito not found"});
      }

      res.status(200).json({message:"Carrito actualizado con exito"});

    } catch (error) {
      res.status(400).json({message:"Error actualizando carrito", error:error.message});
    }
};

CarritoCompraController.deleteCarrito = async (req,res) => {
        try {
            const  deleteCarrito = await cartModel.findByIdAndDelete(req.params.id);
            if (!deleteCarrito) {
                return  res.status(404).json({message:"Carrito no fue encontrado"});
            }
            res.status(200).json({message:"Carrito eliminado con exito"});
        } catch (error) {
          res.status(400).json({message: "Error eliminando el carrito",error: error.message});
        }
};

export default CarritoCompraController;