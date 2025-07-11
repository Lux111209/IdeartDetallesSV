import ResenaGeneral from "../models/ResenaGeneral.js";
import mongoose from "mongoose";

const resenaGeneralController = {};

// GET - Obtener todas las reseñas generales
resenaGeneralController.getResenas = async (req, res) => {
  try {
    const resenas = await ResenaGeneral.find({ activa: true })
      .populate('id_user', 'nombre correo')
      .populate('id_producto', 'name price productType')
      .sort({ fechaResena: -1 });
    
    res.status(200).json({
      success: true,
      data: resenas,
      count: resenas.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener las reseñas",
      error: error.message
    });
  }
};

// GET - Obtener reseña por ID
resenaGeneralController.getResenaById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar que el ID sea válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de reseña no válido"
      });
    }

    const resena = await ResenaGeneral.findById(id)
      .populate('id_user', 'nombre correo')
      .populate('id_producto', 'name price productType description');

    if (!resena) {
      return res.status(404).json({
        success: false,
        message: "Reseña no encontrada"
      });
    }

    res.status(200).json({
      success: true,
      data: resena
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener la reseña",
      error: error.message
    });
  }
};

// POST - Crear una nueva reseña general
resenaGeneralController.createResena = async (req, res) => {
  try {
    const { ranking, titulo, tiposExperiencia, detalle, id_user, id_producto } = req.body;

    // Validaciones básicas
    if (!ranking || !titulo || !detalle || !id_user || !id_producto) {
      return res.status(400).json({
        success: false,
        message: "Todos los campos obligatorios deben ser proporcionados"
      });
    }

    // Validar IDs
    if (!mongoose.Types.ObjectId.isValid(id_user) || !mongoose.Types.ObjectId.isValid(id_producto)) {
      return res.status(400).json({
        success: false,
        message: "IDs de usuario o producto no válidos"
      });
    }

    // Validar que tiposExperiencia sea un array si se proporciona
    let experienciasArray = tiposExperiencia || [];
    if (experienciasArray && !Array.isArray(experienciasArray)) {
      experienciasArray = [experienciasArray];
    }

    // Verificar si ya existe una reseña del mismo usuario para el mismo producto
    const resenaExistente = await ResenaGeneral.findOne({
      id_user: id_user,
      id_producto: id_producto
    });

    if (resenaExistente) {
      return res.status(400).json({
        success: false,
        message: "Ya existe una reseña de este usuario para este producto"
      });
    }

    const nuevaResena = new ResenaGeneral({
      ranking,
      titulo,
      tiposExperiencia: experienciasArray,
      detalle,
      id_user,
      id_producto
    });

    const resenaGuardada = await nuevaResena.save();
    
    // Poblar la reseña guardada para la respuesta
    const resenaCompleta = await ResenaGeneral.findById(resenaGuardada._id)
      .populate('id_user', 'nombre correo')
      .populate('id_producto', 'name price productType');

    res.status(201).json({
      success: true,
      message: "Reseña creada exitosamente",
      data: resenaCompleta
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Ya existe una reseña de este usuario para este producto"
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Error al crear la reseña",
      error: error.message
    });
  }
};

// PUT - Actualizar una reseña por ID
resenaGeneralController.updateResena = async (req, res) => {
  try {
    const { id } = req.params;
    const { ranking, titulo, tiposExperiencia, detalle, activa } = req.body;

    // Validar que el ID sea válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de reseña no válido"
      });
    }

    // Verificar si la reseña existe
    const resenaExistente = await ResenaGeneral.findById(id);
    if (!resenaExistente) {
      return res.status(404).json({
        success: false,
        message: "Reseña no encontrada"
      });
    }

    // Preparar datos de actualización
    const updateData = {};
    
    if (ranking !== undefined) updateData.ranking = ranking;
    if (titulo) updateData.titulo = titulo;
    if (detalle) updateData.detalle = detalle;
    if (activa !== undefined) updateData.activa = activa;
    
    // Validar tipos de experiencia si se proporcionan
    if (tiposExperiencia !== undefined) {
      let experienciasArray = tiposExperiencia;
      if (!Array.isArray(experienciasArray)) {
        experienciasArray = [experienciasArray];
      }
      updateData.tiposExperiencia = experienciasArray;
    }

    const resenaActualizada = await ResenaGeneral.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('id_user', 'nombre correo')
     .populate('id_producto', 'name price productType');

    res.status(200).json({
      success: true,
      message: "Reseña actualizada exitosamente",
      data: resenaActualizada
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar la reseña",
      error: error.message
    });
  }
};

// DELETE - Eliminar una reseña por ID
resenaGeneralController.deleteResena = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar que el ID sea válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de reseña no válido"
      });
    }

    const resenaEliminada = await ResenaGeneral.findByIdAndDelete(id);
    
    if (!resenaEliminada) {
      return res.status(404).json({
        success: false,
        message: "Reseña no encontrada"
      });
    }

    res.status(200).json({
      success: true,
      message: "Reseña eliminada exitosamente",
      data: resenaEliminada
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar la reseña",
      error: error.message
    });
  }
};

// GET - Obtener reseñas por producto
resenaGeneralController.getResenasByProducto = async (req, res) => {
  try {
    const { id_producto } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id_producto)) {
      return res.status(400).json({
        success: false,
        message: "ID de producto no válido"
      });
    }

    const resenas = await ResenaGeneral.find({ 
      id_producto: id_producto, 
      activa: true 
    })
    .populate('id_user', 'nombre')
    .sort({ fechaResena: -1 });

    // Calcular estadísticas
    const totalResenas = resenas.length;
    const promedioRanking = totalResenas > 0 ? 
      resenas.reduce((sum, resena) => sum + resena.ranking, 0) / totalResenas : 0;

    res.status(200).json({
      success: true,
      data: resenas,
      estadisticas: {
        totalResenas,
        promedioRanking: Math.round(promedioRanking * 10) / 10
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener reseñas del producto",
      error: error.message
    });
  }
};

// GET - Obtener reseñas por usuario
resenaGeneralController.getResenasByUsuario = async (req, res) => {
  try {
    const { id_user } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id_user)) {
      return res.status(400).json({
        success: false,
        message: "ID de usuario no válido"
      });
    }

    const resenas = await ResenaGeneral.find({ 
      id_user: id_user, 
      activa: true 
    })
    .populate('id_producto', 'name price productType')
    .sort({ fechaResena: -1 });

    res.status(200).json({
      success: true,
      data: resenas,
      count: resenas.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener reseñas del usuario",
      error: error.message
    });
  }
};

// PUT - Marcar reseña como útil
resenaGeneralController.marcarUtil = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de reseña no válido"
      });
    }

    const resena = await ResenaGeneral.findById(id);
    if (!resena) {
      return res.status(404).json({
        success: false,
        message: "Reseña no encontrada"
      });
    }

    await resena.marcarUtil();

    res.status(200).json({
      success: true,
      message: "Reseña marcada como útil",
      data: resena
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al marcar la reseña como útil",
      error: error.message
    });
  }
};

export default resenaGeneralController;