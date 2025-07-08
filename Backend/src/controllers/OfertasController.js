import Ofertas from "../models/Ofertas.js";
import mongoose from "mongoose";

const OfertasController = {};

// GET - Obtener todas las ofertas
OfertasController.getOfertas = async (req, res) => {
  try {
    const ofertas = await Ofertas.find()
      .populate('productos', 'name price productType')
      .sort({ creada: -1 });
    
    res.status(200).json({
      success: true,
      data: ofertas,
      count: ofertas.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener las ofertas",
      error: error.message
    });
  }
};

// GET - Obtener oferta por ID
OfertasController.getOfertaById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar que el ID sea válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de oferta no válido"
      });
    }

    const oferta = await Ofertas.findById(id)
      .populate('productos', 'name price productType stock');

    if (!oferta) {
      return res.status(404).json({
        success: false,
        message: "Oferta no encontrada"
      });
    }

    res.status(200).json({
      success: true,
      data: oferta
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener la oferta",
      error: error.message
    });
  }
};

// POST - Crear una nueva oferta
OfertasController.createOferta = async (req, res) => {
  try {
    const { nombreOferta, DescuentoRealizado, productos, expirada, activa } = req.body;

    // Validaciones básicas
    if (!nombreOferta || !DescuentoRealizado || !productos || !expirada) {
      return res.status(400).json({
        success: false,
        message: "Todos los campos obligatorios deben ser proporcionados"
      });
    }

    // Validar que productos sea un array
    if (!Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Debe incluir al menos un producto en la oferta"
      });
    }

    // Validar que todos los IDs de productos sean válidos
    const productosValidos = productos.every(id => mongoose.Types.ObjectId.isValid(id));
    if (!productosValidos) {
      return res.status(400).json({
        success: false,
        message: "Uno o más IDs de productos no son válidos"
      });
    }

    // Validar fecha de expiración
    const fechaExpiracion = new Date(expirada);
    if (fechaExpiracion <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "La fecha de expiración debe ser futura"
      });
    }

    const nuevaOferta = new Ofertas({
      nombreOferta,
      DescuentoRealizado,
      productos,
      expirada: fechaExpiracion,
      activa: activa !== undefined ? activa : true
    });

    const ofertaGuardada = await nuevaOferta.save();
    
    // Poblar la oferta guardada para la respuesta
    const ofertaCompleta = await Ofertas.findById(ofertaGuardada._id)
      .populate('productos', 'name price productType');

    res.status(201).json({
      success: true,
      message: "Oferta creada exitosamente",
      data: ofertaCompleta
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear la oferta",
      error: error.message
    });
  }
};

// PUT - Actualizar una oferta por ID
OfertasController.updateOferta = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombreOferta, DescuentoRealizado, productos, expirada, activa } = req.body;

    // Validar que el ID sea válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de oferta no válido"
      });
    }

    // Verificar si la oferta existe
    const ofertaExistente = await Ofertas.findById(id);
    if (!ofertaExistente) {
      return res.status(404).json({
        success: false,
        message: "Oferta no encontrada"
      });
    }

    // Preparar datos de actualización
    const updateData = {};
    
    if (nombreOferta) updateData.nombreOferta = nombreOferta;
    if (DescuentoRealizado !== undefined) updateData.DescuentoRealizado = DescuentoRealizado;
    if (activa !== undefined) updateData.activa = activa;
    
    // Validar productos si se proporcionan
    if (productos) {
      if (!Array.isArray(productos) || productos.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Debe incluir al menos un producto en la oferta"
        });
      }
      
      const productosValidos = productos.every(id => mongoose.Types.ObjectId.isValid(id));
      if (!productosValidos) {
        return res.status(400).json({
          success: false,
          message: "Uno o más IDs de productos no son válidos"
        });
      }
      updateData.productos = productos;
    }

    // Validar fecha de expiración si se proporciona
    if (expirada) {
      const fechaExpiracion = new Date(expirada);
      if (fechaExpiracion <= new Date()) {
        return res.status(400).json({
          success: false,
          message: "La fecha de expiración debe ser futura"
        });
      }
      updateData.expirada = fechaExpiracion;
    }

    const ofertaActualizada = await Ofertas.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('productos', 'name price productType');

    res.status(200).json({
      success: true,
      message: "Oferta actualizada exitosamente",
      data: ofertaActualizada
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar la oferta",
      error: error.message
    });
  }
};

// DELETE - Eliminar una oferta por ID
OfertasController.deleteOferta = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar que el ID sea válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de oferta no válido"
      });
    }

    const ofertaEliminada = await Ofertas.findByIdAndDelete(id);
    
    if (!ofertaEliminada) {
      return res.status(404).json({
        success: false,
        message: "Oferta no encontrada"
      });
    }

    res.status(200).json({
      success: true,
      message: "Oferta eliminada exitosamente",
      data: ofertaEliminada
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar la oferta",
      error: error.message
    });
  }
};

// GET - Obtener ofertas activas
OfertasController.getOfertasActivas = async (req, res) => {
  try {
    const now = new Date();
    const ofertasActivas = await Ofertas.find({
      activa: true,
      expirada: { $gt: now }
    }).populate('productos', 'name price productType');

    res.status(200).json({
      success: true,
      data: ofertasActivas,
      count: ofertasActivas.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener ofertas activas",
      error: error.message
    });
  }
};

export default OfertasController;