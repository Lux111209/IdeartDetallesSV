import Ofertas from "../models/Ofertas.js";
import mongoose from "mongoose";

const OfertasController = {};

// GET - Obtener todas las ofertas
OfertasController.getOfertas = async (req, res) => {
  try {
    // Buscar todas las ofertas con productos poblados
    const ofertas = await Ofertas.find()
      .populate('productos', 'name price productType')
      .sort({ creada: -1 });
    
    // Respuesta exitosa
    res.json({
      success: true,
      data: ofertas
    });
  } catch (error) {
    // Manejo de errores
    res.status(500).json({
      success: false,
      message: "Error al obtener ofertas"
    });
  }
};

// GET - Obtener oferta por ID
OfertasController.getOfertaById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID no válido"
      });
    }

    // Buscar oferta y poblar productos
    const oferta = await Ofertas.findById(id)
      .populate('productos', 'name price productType stock');

    // Verificar si existe
    if (!oferta) {
      return res.status(404).json({
        success: false,
        message: "Oferta no encontrada"
      });
    }

    // Respuesta exitosa
    res.json({
      success: true,
      data: oferta
    });
  } catch (error) {
    // Manejo de errores
    res.status(500).json({
      success: false,
      message: "Error al obtener oferta"
    });
  }
};

// POST - Crear nueva oferta
OfertasController.createOferta = async (req, res) => {
  try {
    const { nombreOferta, DescuentoRealizado, productos, expirada, activa } = req.body;

    // Validar campos obligatorios
    if (!nombreOferta || !DescuentoRealizado || !productos || !expirada) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos obligatorios"
      });
    }

    // Validar que productos sea un array con elementos
    if (!Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Debe incluir al menos un producto"
      });
    }

    // Validar fecha de expiración futura
    const fechaExpiracion = new Date(expirada);
    if (fechaExpiracion <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "La fecha de expiración debe ser futura"
      });
    }

    // Crear nueva oferta
    const nuevaOferta = new Ofertas({
      nombreOferta,
      DescuentoRealizado,
      productos,
      expirada: fechaExpiracion,
      activa: activa !== undefined ? activa : true
    });

    // Guardar en base de datos
    const guardada = await nuevaOferta.save();
    
    // Poblar para respuesta
    const completa = await Ofertas.findById(guardada._id)
      .populate('productos', 'name price productType');

    // Respuesta exitosa
    res.status(201).json({
      success: true,
      data: completa
    });
  } catch (error) {
    // Manejo de errores
    res.status(500).json({
      success: false,
      message: "Error al crear oferta"
    });
  }
};

// PUT - Actualizar oferta
OfertasController.updateOferta = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombreOferta, DescuentoRealizado, productos, expirada, activa } = req.body;

    // Validar ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID no válido"
      });
    }

    // Verificar que existe la oferta
    const existe = await Ofertas.findById(id);
    if (!existe) {
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
          message: "Debe incluir al menos un producto"
        });
      }
      updateData.productos = productos;
    }

    // Validar fecha de expiración si se actualiza
    if (expirada) {
      const fechaExpiracion = new Date(expirada);
      if (fechaExpiracion <= new Date()) {
        return res.status(400).json({
          success: false,
          message: "La fecha debe ser futura"
        });
      }
      updateData.expirada = fechaExpiracion;
    }

    // Actualizar en base de datos
    const actualizada = await Ofertas.findByIdAndUpdate(id, updateData, { new: true })
      .populate('productos', 'name price productType');

    // Respuesta exitosa
    res.json({
      success: true,
      data: actualizada
    });
  } catch (error) {
    // Manejo de errores
    res.status(500).json({
      success: false,
      message: "Error al actualizar oferta"
    });
  }
};

// DELETE - Eliminar oferta
OfertasController.deleteOferta = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID no válido"
      });
    }

    // Eliminar de base de datos
    const eliminada = await Ofertas.findByIdAndDelete(id);
    
    // Verificar si existía
    if (!eliminada) {
      return res.status(404).json({
        success: false,
        message: "Oferta no encontrada"
      });
    }

    // Respuesta exitosa
    res.json({
      success: true,
      message: "Oferta eliminada"
    });
  } catch (error) {
    // Manejo de errores
    res.status(500).json({
      success: false,
      message: "Error al eliminar oferta"
    });
  }
};

// GET - Obtener solo ofertas activas y vigentes
OfertasController.getOfertasActivas = async (req, res) => {
  try {
    const ahora = new Date();
    
    // Buscar ofertas activas que no han expirado
    const activas = await Ofertas.find({
      activa: true,
      expirada: { $gt: ahora }
    }).populate('productos', 'name price productType');

    // Respuesta exitosa
    res.json({
      success: true,
      data: activas,
      total: activas.length
    });
  } catch (error) {
    // Manejo de errores
    res.status(500).json({
      success: false,
      message: "Error al obtener ofertas activas"
    });
  }
};

// GET - Verificar si oferta está vigente
OfertasController.isOfertaVigente = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID no válido"
      });
    }

    // Buscar oferta
    const oferta = await Ofertas.findById(id);
    if (!oferta) {
      return res.status(404).json({
        success: false,
        message: "Oferta no encontrada"
      });
    }

    // Verificar si está vigente
    const ahora = new Date();
    const vigente = oferta.activa && ahora <= oferta.expirada;

    // Respuesta exitosa
    res.json({
      success: true,
      vigente: vigente,
      data: {
        id: oferta._id,
        nombre: oferta.nombreOferta,
        descuento: oferta.DescuentoRealizado,
        expira: oferta.expirada,
        activa: oferta.activa
      }
    });
  } catch (error) {
    // Manejo de errores
    res.status(500).json({
      success: false,
      message: "Error al verificar oferta"
    });
  }
};

// GET - Buscar ofertas por producto
OfertasController.getOfertasByProducto = async (req, res) => {
  try {
    const { id_producto } = req.params;

    // Validar ID de producto
    if (!mongoose.Types.ObjectId.isValid(id_producto)) {
      return res.status(400).json({
        success: false,
        message: "ID de producto no válido"
      });
    }

    const ahora = new Date();

    // Buscar ofertas vigentes que incluyan el producto
    const ofertas = await Ofertas.find({
      productos: id_producto,
      activa: true,
      expirada: { $gt: ahora }
    }).populate('productos', 'name price productType');

    // Respuesta exitosa
    res.json({
      success: true,
      data: ofertas,
      total: ofertas.length
    });
  } catch (error) {
    // Manejo de errores
    res.status(500).json({
      success: false,
      message: "Error al buscar ofertas del producto"
    });
  }
};

export default OfertasController;