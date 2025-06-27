import cartModel from '../models/CarritoCompra.js';
import { config } from '../config.js';

const CarritoCompraController ={};


//Funcion para traer la info de carrito:
CarritoCompraController.getCarritoCompra = async (req, res) => {
  try {
    const carrito = await cartModel.find()
      .populate("products.idProducts","stock price")
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

//Funcion para ver solo uno:

CarritoCompraController.getCarritoCompraById = async (req,res) => {
    try {
        //Falta por hacer
    } catch (error) {
        
        //Falta por hacer
    }
};



///Funcion para crear un carrito

CarritoCompraController.createCarritoCompra = async (req,res) => {
    const {
        products,
        idUser,
        Ofertas,
        total,
    }= req.body;

    try {
        //Validamos que tengan los campos necesarios
        if (
           !Array.isArray(products) ||
           !Array.isArray(Ofertas) ||
            products.length === 0 ||
            Ofertas.length === 0 ) 
  {
        return res.status(400).json({message:"El array de productos y ofertas son requeridos y no pueden estar vacios"}) 
  }


  const newCarrito = new cartModel({
    products,
    idUser,
    Ofertas,
    total
  });

  await newCarrito.save();
  res.status(201).json({message:"Carrito creado con exito "})
    } catch (error) {
        res.status(400).json({message:"Error creando el carrito", error: error.message});
    }
};

//Funcion para eliminar uno 

//fALTA POR HACER

//fUNCION PARA ACTUALIZAR UNO 
//FALTA POR HACERLO