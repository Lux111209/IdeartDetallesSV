import Ofertas from "../models/Ofertas.js";
import mongoose from "mongoose";

const OfertasController = {};

// ===== OBTENER TODAS LAS OFERTAS =====
OfertasController.getOfertas = async (req, res) => {
  try {
    // Buscar todas las ofertas con productos poblados
    const ofertas = await Ofertas.find()
      .populate('productos', 'name price productType')
      .sort({ creada: -1 }); // Ordenar por fecha de creación descendente
    
    // Respuesta exitosa
    res.status(200).json(ofertas);
  } catch (error) {
    // Error del servidor
    res.status(500).json({
      message: "Error al obtener ofertas",
      error: error.message
    });
  }
};

// ===== OBTENER OFERTA POR ID =====
OfertasController.getOfertaById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar que el ID sea válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    // Buscar oferta por ID y poblar productos
    const oferta = await Ofertas.findById(id)
      .populate('productos', 'name price productType stock');

    // Verificar si la oferta existe
    if (!oferta) {
      return res.status(404).json({ message: "Oferta no encontrada" });
    }

    // Respuesta exitosa
    res.status(200).json(oferta);
  } catch (error) {
    // Error del servidor
    res.status(500).json({
      message: "Error al obtener oferta",
      error: error.message
    });
  }
};

// ===== CREAR NUEVA OFERTA =====
OfertasController.createOferta = async (req, res) => {
  try {
    const { nombreOferta, DescuentoRealizado, productos, expirada, activa } = req.body;

    // Validar campos requeridos
    if (!nombreOferta || !DescuentoRealizado || !productos || !expirada) {
      return res.status(400).json({ 
        message: "Faltan campos requeridos: nombreOferta, DescuentoRealizado, productos, expirada" 
      });
    }

    // Validar que nombreOferta no esté vacío
    if (nombreOferta.trim().length === 0) {
      return res.status(400).json({ message: "El nombre de la oferta no puede estar vacío" });
    }

    // Validar que DescuentoRealizado sea un número válido
    if (typeof DescuentoRealizado !== 'number' || DescuentoRealizado <= 0 || DescuentoRealizado > 100) {
      return res.status(400).json({ message: "El descuento debe ser un número entre 1 y 100" });
    }

    // Validar que productos sea un array con elementos
    if (!Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ message: "Debe incluir al menos un producto" });
    }

    // Validar cada ID de producto
    for (let producto of productos) {
      if (!mongoose.Types.ObjectId.isValid(producto)) {
        return res.status(400).json({ message: "ID de producto inválido" });
      }
    }

    // Validar fecha de expiración
    const fechaExpiracion = new Date(expirada);
    if (isNaN(fechaExpiracion.getTime())) {
      return res.status(400).json({ message: "Fecha de expiración inválida" });
    }
    
    if (fechaExpiracion <= new Date()) {
      return res.status(400).json({ message: "La fecha de expiración debe ser futura" });
    }

    // Crear nueva oferta
    const nuevaOferta = new Ofertas({
      nombreOferta: nombreOferta.trim(),
      DescuentoRealizado,
      productos,
      expirada: fechaExpiracion,
      activa: activa !== undefined ? activa : true // Por defecto activa
    });

    // Guardar en base de datos
    await nuevaOferta.save();
    
    // Respuesta exitosa
    res.status(201).json({ message: "Oferta creada exitosamente" });
  } catch (error) {
    // Error del servidor
    res.status(500).json({
      message: "Error al crear oferta",
      error: error.message
    });
  }
};

// ===== ACTUALIZAR OFERTA =====
OfertasController.updateOferta = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombreOferta, DescuentoRealizado, productos, expirada, activa } = req.body;

    // Validar que el ID sea válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    // Crear objeto de actualización solo con campos enviados
    const updateData = {};

    // Validar y agregar nombreOferta si se envía
    if (nombreOferta) {
      if (nombreOferta.trim().length === 0) {
        return res.status(400).json({ message: "El nombre de la oferta no puede estar vacío" });
      }
      updateData.nombreOferta = nombreOferta.trim();
    }

    // Validar y agregar DescuentoRealizado si se envía
    if (DescuentoRealizado !== undefined) {
      if (typeof DescuentoRealizado !== 'number' || DescuentoRealizado <= 0 || DescuentoRealizado > 100) {
        return res.status(400).json({ message: "El descuento debe ser un número entre 1 y 100" });
      }
      updateData.DescuentoRealizado = DescuentoRealizado;
    }

    // Validar y agregar productos si se envían
    if (productos) {
      if (!Array.isArray(productos) || productos.length === 0) {
        return res.status(400).json({ message: "Debe incluir al menos un producto" });
      }
      
      // Validar cada ID de producto
      for (let producto of productos) {
        if (!mongoose.Types.ObjectId.isValid(producto)) {
          return res.status(400).json({ message: "ID de producto inválido" });
        }
      }
      updateData.productos = productos;
    }

    // Validar y agregar fecha de expiración si se envía
    if (expirada) {
      const fechaExpiracion = new Date(expirada);
      if (isNaN(fechaExpiracion.getTime())) {
        return res.status(400).json({ message: "Fecha de expiración inválida" });
      }
      
      if (fechaExpiracion <= new Date()) {
        return res.status(400).json({ message: "La fecha de expiración debe ser futura" });
      }
      updateData.expirada = fechaExpiracion;
    }

    // Agregar activa si se envía
    if (activa !== undefined) {
      updateData.activa = activa;
    }

    // Actualizar oferta en base de datos
    const actualizada = await Ofertas.findByIdAndUpdate(id, updateData, { new: true })
      .populate('productos', 'name price productType');

    // Verificar si la oferta existe
    if (!actualizada) {
      return res.status(404).json({ message: "Oferta no encontrada" });
    }

    // Respuesta exitosa
    res.status(200).json({ message: "Oferta actualizada exitosamente" });
  } catch (error) {
    // Error del servidor
    res.status(500).json({
      message: "Error al actualizar oferta",
      error: error.message
    });
  }
};

// ===== ELIMINAR OFERTA =====
OfertasController.deleteOferta = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar que el ID sea válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    // Eliminar oferta de la base de datos
    const eliminada = await Ofertas.findByIdAndDelete(id);
    
    // Verificar si la oferta existía
    if (!eliminada) {
      return res.status(404).json({ message: "Oferta no encontrada" });
    }

    // Respuesta exitosa
    res.status(200).json({ message: "Oferta eliminada exitosamente" });
  } catch (error) {
    // Error del servidor
    res.status(500).json({
      message: "Error al eliminar oferta",
      error: error.message
    });
  }
};

// ===== OBTENER OFERTAS ACTIVAS Y VIGENTES =====
OfertasController.getOfertasActivas = async (req, res) => {
  try {
    const ahora = new Date();
    
    // Buscar ofertas que estén activas y no hayan expirado
    const activas = await Ofertas.find({
      activa: true,
      expirada: { $gt: ahora } // Fecha de expiración mayor a ahora
    }).populate('productos', 'name price productType');

    // Respuesta exitosa
    res.status(200).json(activas);
  } catch (error) {
    // Error del servidor
    res.status(500).json({
      message: "Error al obtener ofertas activas",
      error: error.message
    });
  }
};

// ===== VERIFICAR SI OFERTA ESTÁ VIGENTE =====
OfertasController.isOfertaVigente = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar que el ID sea válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    // Buscar la oferta por ID
    const oferta = await Ofertas.findById(id);
    if (!oferta) {
      return res.status(404).json({ message: "Oferta no encontrada" });
    }

    // Verificar si la oferta está vigente (activa y no expirada)
    const ahora = new Date();
    const vigente = oferta.activa && ahora <= oferta.expirada;

    // Respuesta exitosa con información de vigencia
    res.status(200).json({
      vigente: vigente,
      nombre: oferta.nombreOferta,
      descuento: oferta.DescuentoRealizado,
      expira: oferta.expirada,
      activa: oferta.activa
    });
  } catch (error) {
    // Error del servidor
    res.status(500).json({
      message: "Error al verificar oferta",
      error: error.message
    });
  }
};

// ===== BUSCAR OFERTAS POR PRODUCTO =====
OfertasController.getOfertasByProducto = async (req, res) => {
  try {
    const { id_producto } = req.params;

    // Validar que el ID del producto sea válido
    if (!mongoose.Types.ObjectId.isValid(id_producto)) {
      return res.status(400).json({ message: "ID de producto inválido" });
    }

    const ahora = new Date();

    // Buscar ofertas vigentes que incluyan el producto específico
    const ofertas = await Ofertas.find({
      productos: id_producto, // El producto está en el array de productos
      activa: true,
      expirada: { $gt: ahora } // Fecha de expiración mayor a ahora
    }).populate('productos', 'name price productType');

    // Respuesta exitosa (puede ser array vacío si no hay ofertas)
    res.status(200).json(ofertas);
  } catch (error) {
    // Error del servidor
    res.status(500).json({
      message: "Error al buscar ofertas del producto",
      error: error.message
    });
  }
};

export default OfertasController;