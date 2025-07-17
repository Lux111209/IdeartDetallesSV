import cartModel from '../models/CarritoCompra.js';
import { config } from "../../config.js";
import mongoose from 'mongoose';  

const CarritoCompraController = {};

// ===== OBTENER TODOS LOS CARRITOS =====
CarritoCompraController.getCarritoCompra = async (req, res) => {
  try {
    // Buscar todos los carritos y poblar las referencias
    const carrito = await cartModel.find()
      .populate("products.idProducts", "stock price")
      .populate("idUser")
      .populate("Ofertas.idOfertas", "nombreOferta DescuentoRealizado");

    // Respuesta exitosa
    res.status(200).json(carrito);
  } catch (error) {
    // Error del servidor
    res.status(500).json({
      message: "Error al obtener carritos",
      error: error.message,
    });
  }
};

// ===== OBTENER CARRITO POR ID =====
CarritoCompraController.getCarritoCompraById = async (req, res) => {
  try {
    // Validar que el ID sea válido
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    // Buscar carrito por ID y poblar referencias
    const carrito = await cartModel.findById(req.params.id)
      .populate("products.idProducts", "stock price")
      .populate("idUser")
      .populate("Ofertas.idOfertas", "nombreOferta DescuentoRealizado");

    // Verificar si el carrito existe
    if (!carrito) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    // Respuesta exitosa
    res.status(200).json(carrito);
  } catch (error) {
    // Error del servidor
    res.status(500).json({ 
      message: "Error al buscar el carrito", 
      error: error.message 
    });
  }
};

// ===== CREAR NUEVO CARRITO =====
CarritoCompraController.createCarritoCompra = async (req, res) => {
  const { products, idUser, Ofertas, total } = req.body;

  try {
    // Validar campos requeridos
    if (!products || !idUser || total === undefined) {
      return res.status(400).json({ 
        message: "Faltan campos requeridos: products, idUser y total" 
      });
    }

    // Validar que products sea un array no vacío
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ 
        message: "Products debe ser un array con al menos un producto" 
      });
    }

    // Validar que idUser sea un ID válido
    if (!mongoose.Types.ObjectId.isValid(idUser)) {
      return res.status(400).json({ message: "ID de usuario inválido" });
    }

    // Validar cada producto en el array
    for (let product of products) {
      if (!product.idProducts || !mongoose.Types.ObjectId.isValid(product.idProducts)) {
        return res.status(400).json({ message: "ID de producto inválido" });
      }
      if (!product.cantidad || product.cantidad <= 0) {
        return res.status(400).json({ message: "Cantidad debe ser mayor a 0" });
      }
    }

    // Validar ofertas si existen
    if (Ofertas && Ofertas.length > 0) {
      for (let oferta of Ofertas) {
        if (!mongoose.Types.ObjectId.isValid(oferta.idOfertas)) {
          return res.status(400).json({ message: "ID de oferta inválido" });
        }
      }
    }

    // Validar que total sea un número positivo
    if (typeof total !== 'number' || total < 0) {
      return res.status(400).json({ message: "Total debe ser un número positivo" });
    }

    // Crear nuevo carrito
    const newCarrito = new cartModel({
      products,
      idUser,
      Ofertas: Ofertas || [], // Si no hay ofertas, array vacío
      total
    });

    // Guardar en base de datos
    await newCarrito.save();
    
    // Respuesta exitosa
    res.status(201).json({ message: "Carrito creado exitosamente" });

  } catch (error) {
    // Error del servidor
    res.status(500).json({ 
      message: "Error al crear el carrito", 
      error: error.message 
    });
  }
};

// ===== ACTUALIZAR CARRITO =====
CarritoCompraController.updateCarrito = async (req, res) => {
  const { products, idUser, Ofertas, total } = req.body;
        
  try {
    // Validar que el ID del carrito sea válido
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID de carrito inválido" });
    }

    // Validar products si se envía
    if (products) {
      if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ 
          message: "Products debe ser un array con al menos un producto" 
        });
      }
      
      // Validar cada producto
      for (let product of products) {
        if (!product.idProducts || !mongoose.Types.ObjectId.isValid(product.idProducts)) {
          return res.status(400).json({ message: "ID de producto inválido" });
        }
        if (!product.cantidad || product.cantidad <= 0) {
          return res.status(400).json({ message: "Cantidad debe ser mayor a 0" });
        }
      }
    }

    // Validar idUser si se envía
    if (idUser && !mongoose.Types.ObjectId.isValid(idUser)) {
      return res.status(400).json({ message: "ID de usuario inválido" });
    }

    // Validar ofertas si se envían
    if (Ofertas && Ofertas.length > 0) {
      for (let oferta of Ofertas) {
        if (!mongoose.Types.ObjectId.isValid(oferta.idOfertas)) {
          return res.status(400).json({ message: "ID de oferta inválido" });
        }
      }
    }

    // Validar total si se envía
    if (total !== undefined && (typeof total !== 'number' || total < 0)) {
      return res.status(400).json({ message: "Total debe ser un número positivo" });
    }

    // Crear objeto de actualización solo con campos enviados
    const update = {};
    if (products) update.products = products;
    if (idUser) update.idUser = idUser;
    if (Ofertas) update.Ofertas = Ofertas;
    if (total !== undefined) update.total = total;
      
    // Actualizar carrito en base de datos
    const updateCarrito = await cartModel.findByIdAndUpdate(req.params.id, update, { new: true })
      .populate("products.idProducts", "stock price")
      .populate("idUser")
      .populate("Ofertas.idOfertas", "nombreOferta DescuentoRealizado");

    // Verificar si el carrito existe
    if (!updateCarrito) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    // Respuesta exitosa
    res.status(200).json({ message: "Carrito actualizado exitosamente" });

  } catch (error) {
    // Error del servidor
    res.status(500).json({ 
      message: "Error al actualizar carrito", 
      error: error.message 
    });
  }
};

// ===== ELIMINAR CARRITO =====
CarritoCompraController.deleteCarrito = async (req, res) => {
  try {
    // Validar que el ID sea válido
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID de carrito inválido" });
    }

    // Eliminar carrito de la base de datos
    const deleteCarrito = await cartModel.findByIdAndDelete(req.params.id);
    
    // Verificar si el carrito existía
    if (!deleteCarrito) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    // Respuesta exitosa
    res.status(200).json({ message: "Carrito eliminado exitosamente" });
  } catch (error) {
    // Error del servidor
    res.status(500).json({ 
      message: "Error al eliminar el carrito", 
      error: error.message 
    });
  }
};

export default CarritoCompraController;