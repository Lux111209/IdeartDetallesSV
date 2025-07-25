import ResenaGeneral from "../models/ResenaGeneral.js";
import mongoose from "mongoose";

const resenaGeneralController = {};

// GET - Obtener todas las reseñas
resenaGeneralController.getResenas = async (req, res) => {
  try {
    // Buscar reseñas activas y poblar referencias
    const resenas = await ResenaGeneral.find({ activa: true })
      .populate('id_user', 'nombre correo')
      .populate('id_producto', 'name price')
      .sort({ fechaResena: -1 });
    
    // Respuesta exitosa
    res.json({
      success: true,
      data: resenas
    });
  } catch (error) {
    // Manejo de errores
    res.status(500).json({
      success: false,
      message: "Error al obtener reseñas",
      error: error.message
    });
  }
};

// GET - Obtener reseña por ID
resenaGeneralController.getResenaById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID no válido"
      });
    }

    // Buscar reseña y poblar referencias
    const resena = await ResenaGeneral.findById(id)
      .populate('id_user', 'nombre correo')
      .populate('id_producto', 'name price');

    // Verificar si existe
    if (!resena) {
      return res.status(404).json({
        success: false,
        message: "Reseña no encontrada"
      });
    }

    // Respuesta exitosa
    res.json({
      success: true,
      data: resena
    });
  } catch (error) {
    // Manejo de errores
    res.status(500).json({
      success: false,
      message: "Error al obtener reseña",
      error: error.message
    });
  }
};

// POST - Crear nueva reseña
resenaGeneralController.createResena = async (req, res) => {
  try {
    const { ranking, titulo, tiposExperiencia, detalle, id_user, id_producto } = req.body;

    // Validar campos requeridos
    if (!ranking || !titulo || !detalle || !id_user || !id_producto) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos obligatorios: ranking, titulo, detalle, id_user, id_producto"
      });
    }

    // Validar que titulo no esté vacío
    if (titulo.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "El título no puede estar vacío"
      });
    }

    // Validar que detalle no esté vacío
    if (detalle.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "El detalle no puede estar vacío"
      });
    }

    // Validar ranking (debe ser número entre 1 y 5)
    if (typeof ranking !== 'number' || ranking < 1 || ranking > 5) {
      return res.status(400).json({
        success: false,
        message: "El ranking debe ser un número entre 1 y 5"
      });
    }

    // Validar IDs de usuario y producto
    if (!mongoose.Types.ObjectId.isValid(id_user)) {
      return res.status(400).json({
        success: false,
        message: "ID de usuario inválido"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id_producto)) {
      return res.status(400).json({
        success: false,
        message: "ID de producto inválido"
      });
    }

    // Validar tiposExperiencia si se proporciona
    if (tiposExperiencia && !Array.isArray(tiposExperiencia)) {
      return res.status(400).json({
        success: false,
        message: "Los tipos de experiencia deben ser un array"
      });
    }

    // Verificar reseña duplicada
    const existe = await ResenaGeneral.findOne({ id_user, id_producto });
    if (existe) {
      return res.status(409).json({
        success: false,
        message: "Ya existe una reseña de este usuario para este producto"
      });
    }

    // Crear nueva reseña
    const nuevaResena = new ResenaGeneral({
      ranking,
      titulo: titulo.trim(),
      tiposExperiencia: tiposExperiencia || [],
      detalle: detalle.trim(),
      id_user,
      id_producto
    });

    // Guardar en base de datos
    const guardada = await nuevaResena.save();
    
    // Poblar para respuesta
    const completa = await ResenaGeneral.findById(guardada._id)
      .populate('id_user', 'nombre correo')
      .populate('id_producto', 'name price');

    // Respuesta exitosa
    res.status(201).json({
      success: true,
      data: completa
    });
  } catch (error) {
    // Manejo de errores
    res.status(500).json({
      success: false,
      message: "Error al crear reseña",
      error: error.message
    });
  }
};

// PUT - Actualizar reseña
resenaGeneralController.updateResena = async (req, res) => {
  try {
    const { id } = req.params;
    const { ranking, titulo, tiposExperiencia, detalle, activa } = req.body;

    // Validar ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID no válido"
      });
    }

    // Preparar datos de actualización
    const updateData = {};
    
    // Validar y agregar ranking si se proporciona
    if (ranking !== undefined) {
      if (typeof ranking !== 'number' || ranking < 1 || ranking > 5) {
        return res.status(400).json({
          success: false,
          message: "El ranking debe ser un número entre 1 y 5"
        });
      }
      updateData.ranking = ranking;
    }

    // Validar y agregar titulo si se proporciona
    if (titulo) {
      if (titulo.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: "El título no puede estar vacío"
        });
      }
      updateData.titulo = titulo.trim();
    }

    // Validar y agregar detalle si se proporciona
    if (detalle) {
      if (detalle.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: "El detalle no puede estar vacío"
        });
      }
      updateData.detalle = detalle.trim();
    }

    // Validar tiposExperiencia si se proporciona
    if (tiposExperiencia) {
      if (!Array.isArray(tiposExperiencia)) {
        return res.status(400).json({
          success: false,
          message: "Los tipos de experiencia deben ser un array"
        });
      }
      updateData.tiposExperiencia = tiposExperiencia;
    }

    if (activa !== undefined) updateData.activa = activa;

    // Actualizar en base de datos
    const actualizada = await ResenaGeneral.findByIdAndUpdate(id, updateData, { new: true })
      .populate('id_user', 'nombre correo')
      .populate('id_producto', 'name price');

    // Verificar si existe
    if (!actualizada) {
      return res.status(404).json({
        success: false,
        message: "Reseña no encontrada"
      });
    }

    // Respuesta exitosa
    res.json({
      success: true,
      data: actualizada
    });
  } catch (error) {
    // Manejo de errores
    res.status(500).json({
      success: false,
      message: "Error al actualizar reseña",
      error: error.message
    });
  }
};

// DELETE - Eliminar reseña
resenaGeneralController.deleteResena = async (req, res) => {
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
    const eliminada = await ResenaGeneral.findByIdAndDelete(id);
    
    // Verificar si existía
    if (!eliminada) {
      return res.status(404).json({
        success: false,
        message: "Reseña no encontrada"
      });
    }

    // Respuesta exitosa
    res.json({
      success: true,
      message: "Reseña eliminada"
    });
  } catch (error) {
    // Manejo de errores
    res.status(500).json({
      success: false,
      message: "Error al eliminar reseña",
      error: error.message
    });
  }
};

// GET - Reseñas por producto
resenaGeneralController.getResenasByProducto = async (req, res) => {
  try {
    const { id_producto } = req.params;

    // Validar ID de producto
    if (!mongoose.Types.ObjectId.isValid(id_producto)) {
      return res.status(400).json({
        success: false,
        message: "ID de producto inválido"
      });
    }

    // Buscar reseñas del producto
    const resenas = await ResenaGeneral.find({ id_producto, activa: true })
      .populate('id_user', 'nombre')
      .sort({ fechaResena: -1 });

    // Calcular promedio de ranking
    const total = resenas.length;
    const promedio = total > 0 ? 
      resenas.reduce((sum, r) => sum + r.ranking, 0) / total : 0;

    // Respuesta exitosa
    res.json({
      success: true,
      data: resenas,
      total: total,
      promedio: Math.round(promedio * 10) / 10
    });
  } catch (error) {
    // Manejo de errores
    res.status(500).json({
      success: false,
      message: "Error al obtener reseñas del producto",
      error: error.message
    });
  }
};

// GET - Reseñas por usuario
resenaGeneralController.getResenasByUsuario = async (req, res) => {
  try {
    const { id_user } = req.params;

    // Validar ID de usuario
    if (!mongoose.Types.ObjectId.isValid(id_user)) {
      return res.status(400).json({
        success: false,
        message: "ID de usuario inválido"
      });
    }

    // Buscar reseñas del usuario
    const resenas = await ResenaGeneral.find({ id_user, activa: true })
      .populate('id_producto', 'name price')
      .sort({ fechaResena: -1 });

    // Respuesta exitosa
    res.json({
      success: true,
      data: resenas,
      total: resenas.length
    });
  } catch (error) {
    // Manejo de errores
    res.status(500).json({
      success: false,
      message: "Error al obtener reseñas del usuario",
      error: error.message
    });
  }
};

// PUT - Marcar como útil
resenaGeneralController.marcarUtil = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID no válido"
      });
    }

    // Buscar reseña
    const resena = await ResenaGeneral.findById(id);
    if (!resena) {
      return res.status(404).json({
        success: false,
        message: "Reseña no encontrada"
      });
    }

    // Incrementar utilidad
    resena.util += 1;
    await resena.save();

    // Respuesta exitosa
    res.json({
      success: true,
      util: resena.util
    });
  } catch (error) {
    // Manejo de errores
    res.status(500).json({
      success: false,
      message: "Error al marcar como útil",
      error: error.message
    });
  }
};

export default resenaGeneralController;