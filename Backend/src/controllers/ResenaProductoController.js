import ResenaProducto from "../models/ResenaProducto.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const resenaProductoController = {};

// Función auxiliar para subir imágenes a Cloudinary
const uploadImages = async (files) => {
  if (!files || files.length === 0) return [];

  const imageUrls = [];
  for (const file of files) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "ResenasProducto",
        transformation: [{ width: 800, height: 600, crop: "limit" }],
        quality: "auto:good"
      });
      imageUrls.push(result.secure_url);
    } catch (error) {
      console.error("Error subiendo imagen:", error);
    }
  }
  return imageUrls;
};

// Función auxiliar para eliminar imágenes de Cloudinary
const deleteImages = async (imageUrls) => {
  if (!imageUrls || imageUrls.length === 0) return;

  for (const imageUrl of imageUrls) {
    try {
      const fileName = imageUrl.split('/').pop().split('.')[0];
      const publicId = `ResenasProducto/${fileName}`;
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error("Error eliminando imagen:", error);
    }
  }
};

// GET - Obtener todas las reseñas activas
resenaProductoController.getResenasProducto = async (req, res) => {
  try {
    const resenas = await ResenaProducto.find({ activa: true })
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
      message: "Error al obtener reseñas",
      error: error.message
    });
  }
};

// GET - Obtener reseña por ID
resenaProductoController.getResenaProductoById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID no válido"
      });
    }

    const resena = await ResenaProducto.findById(id)
      .populate('id_user', 'nombre correo')
      .populate('id_producto', 'name price productType');

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
      message: "Error al obtener reseña",
      error: error.message
    });
  }
};

// POST - Crear nueva reseña con imágenes
resenaProductoController.createResenaProducto = async (req, res) => {
  try {
    const { ranking, titulo, detalle, id_user, id_producto, compraVerificada, tags } = req.body;

    // Validar campos obligatorios
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

    // Validar ObjectIds
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

    // Validar tags si se proporcionan
    if (tags && !Array.isArray(tags)) {
      return res.status(400).json({
        success: false,
        message: "Los tags deben ser un array"
      });
    }

    // Verificar si ya existe reseña del usuario para este producto
    const resenaExistente = await ResenaProducto.findOne({ id_user, id_producto });
    if (resenaExistente) {
      return res.status(409).json({
        success: false,
        message: "Ya existe una reseña de este usuario para este producto"
      });
    }

    // Procesar archivos de imagen
    let files = [];
    if (req.files?.img) {
      files = Array.isArray(req.files.img) ? req.files.img : [req.files.img];
    } else if (req.file) {
      files = [req.file];
    }

    // Subir imágenes a Cloudinary
    let imgUrls = [];
    if (files.length > 0) {
      try {
        imgUrls = await uploadImages(files);
      } catch (uploadError) {
        return res.status(400).json({
          success: false,
          message: "Error al subir imágenes",
          error: uploadError.message
        });
      }
    }

    // Procesar tags
    const tagsArray = tags ? (Array.isArray(tags) ? tags : [tags]) : [];

    // Crear nueva reseña
    const nuevaResena = new ResenaProducto({
      ranking,
      titulo: titulo.trim(),
      detalle: detalle.trim(),
      id_user,
      id_producto,
      compraVerificada: compraVerificada || false,
      img: imgUrls,
      tags: tagsArray
    });

    const savedResena = await nuevaResena.save();
    
    // Poblar datos para respuesta
    const resenaCompleta = await ResenaProducto.findById(savedResena._id)
      .populate('id_user', 'nombre correo')
      .populate('id_producto', 'name price productType');

    res.status(201).json({
      success: true,
      message: "Reseña creada exitosamente",
      data: resenaCompleta
    });
  } catch (error) {
    // Manejar error de duplicado (índice único)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Ya existe una reseña de este usuario para este producto"
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Error al crear reseña",
      error: error.message
    });
  }
};

// PUT - Actualizar reseña existente
resenaProductoController.updateResenaProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { ranking, titulo, detalle, compraVerificada, respuestaVendedor, tags, activa } = req.body;

    // Validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID no válido"
      });
    }

    const resena = await ResenaProducto.findById(id);
    if (!resena) {
      return res.status(404).json({
        success: false,
        message: "Reseña no encontrada"
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

    if (compraVerificada !== undefined) updateData.compraVerificada = compraVerificada;
    if (activa !== undefined) updateData.activa = activa;

    // Manejar respuesta del vendedor
    if (respuestaVendedor !== undefined) {
      if (respuestaVendedor && respuestaVendedor.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: "La respuesta del vendedor no puede estar vacía"
        });
      }
      updateData.respuestaVendedor = respuestaVendedor.trim();
      if (respuestaVendedor.trim()) {
        updateData.fechaRespuestaVendedor = new Date();
      }
    }

    // Procesar tags
    if (tags !== undefined) {
      if (!Array.isArray(tags)) {
        return res.status(400).json({
          success: false,
          message: "Los tags deben ser un array"
        });
      }
      updateData.tags = tags;
    }

    // Manejar nuevas imágenes
    let files = [];
    if (req.files?.img) {
      files = Array.isArray(req.files.img) ? req.files.img : [req.files.img];
    } else if (req.file) {
      files = [req.file];
    }

    // Si hay nuevas imágenes, reemplazar las anteriores
    if (files.length > 0) {
      try {
        // Eliminar imágenes anteriores
        await deleteImages(resena.img);
        // Subir nuevas imágenes
        updateData.img = await uploadImages(files);
      } catch (uploadError) {
        return res.status(400).json({
          success: false,
          message: "Error al procesar imágenes",
          error: uploadError.message
        });
      }
    }

    // Actualizar reseña en base de datos
    const updatedResena = await ResenaProducto.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    )
    .populate('id_user', 'nombre correo')
    .populate('id_producto', 'name price productType');

    res.status(200).json({
      success: true,
      message: "Reseña actualizada exitosamente",
      data: updatedResena
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar reseña",
      error: error.message
    });
  }
};

// DELETE - Eliminar reseña completamente
resenaProductoController.deleteResenaProducto = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID no válido"
      });
    }

    const resena = await ResenaProducto.findById(id);
    if (!resena) {
      return res.status(404).json({
        success: false,
        message: "Reseña no encontrada"
      });
    }

    // Eliminar imágenes de Cloudinary
    try {
      await deleteImages(resena.img);
    } catch (deleteError) {
      console.error("Error eliminando imágenes:", deleteError);
      // Continuar con la eliminación de la reseña aunque falle la eliminación de imágenes
    }

    // Eliminar reseña de base de datos
    await ResenaProducto.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: "Reseña eliminada exitosamente"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar reseña",
      error: error.message
    });
  }
};

// GET - Obtener reseñas de un producto específico con estadísticas
resenaProductoController.getResenasByProducto = async (req, res) => {
  try {
    const { id_producto } = req.params;

    // Validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(id_producto)) {
      return res.status(400).json({
        success: false,
        message: "ID de producto no válido"
      });
    }

    // Obtener reseñas del producto
    const resenas = await ResenaProducto.find({ 
      id_producto, 
      activa: true 
    })
    .populate('id_user', 'nombre')
    .sort({ fechaResena: -1 });

    // Calcular estadísticas
    const totalResenas = resenas.length;
    const promedioRanking = totalResenas > 0 ? 
      resenas.reduce((sum, resena) => sum + resena.ranking, 0) / totalResenas : 0;
    
    // Distribución de rankings
    const distribucionRanking = {
      5: resenas.filter(r => r.ranking === 5).length,
      4: resenas.filter(r => r.ranking === 4).length,
      3: resenas.filter(r => r.ranking === 3).length,
      2: resenas.filter(r => r.ranking === 2).length,
      1: resenas.filter(r => r.ranking === 1).length
    };

    res.status(200).json({
      success: true,
      data: resenas,
      estadisticas: {
        totalResenas,
        promedioRanking: Math.round(promedioRanking * 10) / 10,
        distribucionRanking,
        comprasVerificadas: resenas.filter(r => r.compraVerificada).length
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

// GET - Obtener reseñas de un usuario específico
resenaProductoController.getResenasByUsuario = async (req, res) => {
  try {
    const { id_user } = req.params;

    // Validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(id_user)) {
      return res.status(400).json({
        success: false,
        message: "ID de usuario no válido"
      });
    }

    const resenas = await ResenaProducto.find({ 
      id_user, 
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

// PUT - Incrementar contador de utilidad de una reseña
resenaProductoController.marcarUtil = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID no válido"
      });
    }

    const resena = await ResenaProducto.findById(id);
    if (!resena) {
      return res.status(404).json({
        success: false,
        message: "Reseña no encontrada"
      });
    }

    // Incrementar utilidad usando método del modelo
    await resena.marcarUtil();

    res.status(200).json({
      success: true,
      message: "Reseña marcada como útil",
      data: { util: resena.util }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al marcar reseña como útil",
      error: error.message
    });
  }
};

// PUT - Agregar respuesta del vendedor a una reseña
resenaProductoController.agregarRespuestaVendedor = async (req, res) => {
  try {
    const { id } = req.params;
    const { respuesta } = req.body;

    // Validar ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID no válido"
      });
    }

    // Validar datos de entrada
    if (!respuesta) {
      return res.status(400).json({
        success: false,
        message: "La respuesta es obligatoria"
      });
    }

    if (respuesta.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "La respuesta no puede estar vacía"
      });
    }

    const resena = await ResenaProducto.findById(id);
    if (!resena) {
      return res.status(404).json({
        success: false,
        message: "Reseña no encontrada"
      });
    }

    // Agregar respuesta usando método del modelo
    await resena.agregarRespuestaVendedor(respuesta.trim());

    res.status(200).json({
      success: true,
      message: "Respuesta agregada exitosamente",
      data: resena
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al agregar respuesta",
      error: error.message
    });
  }
};

// GET - Obtener solo reseñas con compra verificada
resenaProductoController.getResenasVerificadas = async (req, res) => {
  try {
    const resenas = await ResenaProducto.find({ 
      compraVerificada: true, 
      activa: true 
    })
    .populate('id_user', 'nombre')
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
      message: "Error al obtener reseñas verificadas",
      error: error.message
    });
  }
};

export default resenaProductoController;