import ResenaProducto from "../models/ResenaProducto.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

// Configuración de Cloudinary - Usa variables de entorno directamente
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const resenaProductoController = {};

// Función auxiliar para subir múltiples imágenes a Cloudinary
const uploadMultipleImages = async (files) => {
  const imageUrls = [];
  if (!files || files.length === 0) {
    console.log("No se recibieron archivos de imagen");
    return imageUrls;
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    try {
      if (!file.path) {
        console.error(`Error: El archivo ${i + 1} no tiene ruta válida`, file);
        continue;
      }

      const result = await cloudinary.uploader.upload(file.path, {
        folder: "ResenasProducto",
        resource_type: "auto",
        allowed_formats: ["jpg", "png", "jpeg", "webp", "tiff"],
        transformation: [{ width: 800, height: 600, crop: "limit" }],
        quality: "auto:good",
        fetch_format: "auto"
      });

      if (result && result.secure_url) {
        imageUrls.push(result.secure_url);
      } else {
        console.error(`Error: Cloudinary no devolvió una URL segura para la imagen ${i + 1}`, result);
      }
    } catch (cloudinaryError) {
      console.error(`Error al subir imagen ${i + 1} a Cloudinary:`, cloudinaryError);
    }
  }

  return imageUrls;
};

// Función auxiliar para eliminar imágenes de Cloudinary
const deleteCloudinaryImages = async (imageUrls) => {
  if (!imageUrls || imageUrls.length === 0) return;

  for (const imageUrl of imageUrls) {
    try {
      // Extraer el public_id de la URL de Cloudinary
      const urlParts = imageUrl.split('/');
      const fileNameWithExtension = urlParts.pop();
      const fileName = fileNameWithExtension.split('.')[0];
      const folderPublicId = `ResenasProducto/${fileName}`;
      
      await cloudinary.uploader.destroy(folderPublicId);
      console.log(`Imagen eliminada de Cloudinary: ${folderPublicId}`);
    } catch (error) {
      console.error(`Error al eliminar imagen de Cloudinary: ${imageUrl}`, error);
    }
  }
};

// GET todas las reseñas de productos
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
      message: "Error al obtener reseñas de producto",
      error: error.message
    });
  }
};

// GET reseña por ID
resenaProductoController.getResenaProductoById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de reseña no válido"
      });
    }

    const resena = await ResenaProducto.findById(id)
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

// CREATE reseña de producto con múltiples imágenes
resenaProductoController.createResenaProducto = async (req, res) => {
  try {
    const {
      ranking,
      titulo,
      detalle,
      id_user,
      id_producto,
      compraVerificada,
      respuestaVendedor,
      tags
    } = req.body;

    // Validaciones básicas
    if (!ranking || !titulo || !detalle || !id_user || !id_producto) {
      return res.status(400).json({
        success: false,
        message: "Ranking, título, detalle, ID de usuario e ID de producto son obligatorios"
      });
    }

    // Validar IDs
    if (!mongoose.Types.ObjectId.isValid(id_user) || !mongoose.Types.ObjectId.isValid(id_producto)) {
      return res.status(400).json({
        success: false,
        message: "IDs de usuario o producto no válidos"
      });
    }

    // Verificar si ya existe una reseña del mismo usuario para el mismo producto
    const resenaExistente = await ResenaProducto.findOne({
      id_user: id_user,
      id_producto: id_producto
    });

    if (resenaExistente) {
      return res.status(400).json({
        success: false,
        message: "Ya existe una reseña de este usuario para este producto"
      });
    }

    // Procesar tags
    let tagsArray = tags || [];
    if (tagsArray && !Array.isArray(tagsArray)) {
      tagsArray = [tagsArray];
    }

    // Obtener archivos de imágenes desde multer
    let files = [];
    if (req.files && req.files.img && Array.isArray(req.files.img)) {
      files = req.files.img;
    } else if (req.files && req.files.img) {
      files = [req.files.img];
    } else if (req.files && req.files.images && Array.isArray(req.files.images)) {
      files = req.files.images;
    } else if (req.file) {
      files = [req.file];
    }

    const imgUrls = await uploadMultipleImages(files);

    // Crear la reseña
    const nuevaResena = new ResenaProducto({
      ranking,
      titulo,
      detalle,
      id_user,
      id_producto,
      compraVerificada: compraVerificada || false,
      img: imgUrls,
      respuestaVendedor,
      tags: tagsArray
    });

    const savedResena = await nuevaResena.save();
    
    // Poblar la reseña guardada para la respuesta
    const resenaCompleta = await ResenaProducto.findById(savedResena._id)
      .populate('id_user', 'nombre correo')
      .populate('id_producto', 'name price productType');

    res.status(201).json({
      success: true,
      message: "Reseña de producto creada exitosamente",
      data: resenaCompleta,
      imagesUploaded: imgUrls.length
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
      message: "Error al crear la reseña de producto",
      error: error.message
    });
  }
};

// UPDATE reseña de producto
resenaProductoController.updateResenaProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { ranking, titulo, detalle, compraVerificada, respuestaVendedor, tags, activa } = req.body;

    // Validar que el ID sea válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de reseña no válido"
      });
    }

    const resena = await ResenaProducto.findById(id);
    if (!resena) {
      return res.status(404).json({
        success: false,
        message: "Reseña de producto no encontrada"
      });
    }

    // Preparar datos de actualización
    const updateData = {};
    if (ranking !== undefined) updateData.ranking = ranking;
    if (titulo) updateData.titulo = titulo;
    if (detalle) updateData.detalle = detalle;
    if (compraVerificada !== undefined) updateData.compraVerificada = compraVerificada;
    if (respuestaVendedor !== undefined) {
      updateData.respuestaVendedor = respuestaVendedor;
      if (respuestaVendedor.trim()) {
        updateData.fechaRespuestaVendedor = new Date();
      }
    }
    if (activa !== undefined) updateData.activa = activa;

    // Procesar tags si se proporcionan
    if (tags !== undefined) {
      let tagsArray = tags;
      if (!Array.isArray(tagsArray)) {
        tagsArray = [tagsArray];
      }
      updateData.tags = tagsArray;
    }

    // Manejar nuevas imágenes
    let files = [];
    if (req.files && req.files.img && Array.isArray(req.files.img)) {
      files = req.files.img;
    } else if (req.files && req.files.img) {
      files = [req.files.img];
    } else if (req.files && req.files.images && Array.isArray(req.files.images)) {
      files = req.files.images;
    } else if (req.file) {
      files = [req.file];
    }

    if (files.length > 0) {
      // Eliminar imágenes anteriores de Cloudinary
      if (resena.img && resena.img.length > 0) {
        await deleteCloudinaryImages(resena.img);
      }
      // Subir nuevas imágenes
      const newImgUrls = await uploadMultipleImages(files);
      updateData.img = newImgUrls;
    }

    const updatedResena = await ResenaProducto.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    )
    .populate('id_user', 'nombre correo')
    .populate('id_producto', 'name price productType');

    res.status(200).json({
      success: true,
      message: "Reseña de producto actualizada exitosamente",
      data: updatedResena
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar la reseña de producto",
      error: error.message
    });
  }
};

// DELETE reseña de producto
resenaProductoController.deleteResenaProducto = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar que el ID sea válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de reseña no válido"
      });
    }

    const resena = await ResenaProducto.findById(id);
    if (!resena) {
      return res.status(404).json({
        success: false,
        message: "Reseña de producto no encontrada"
      });
    }

    // Eliminar imágenes de Cloudinary
    if (resena.img && resena.img.length > 0) {
      await deleteCloudinaryImages(resena.img);
    }

    await ResenaProducto.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: "Reseña de producto eliminada exitosamente"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar la reseña de producto",
      error: error.message
    });
  }
};

// GET reseñas por producto
resenaProductoController.getResenasByProducto = async (req, res) => {
  try {
    const { id_producto } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id_producto)) {
      return res.status(400).json({
        success: false,
        message: "ID de producto no válido"
      });
    }

    const resenas = await ResenaProducto.find({ 
      id_producto: id_producto, 
      activa: true 
    })
    .populate('id_user', 'nombre')
    .sort({ fechaResena: -1 });

    // Calcular estadísticas
    const totalResenas = resenas.length;
    const promedioRanking = totalResenas > 0 ? 
      resenas.reduce((sum, resena) => sum + resena.ranking, 0) / totalResenas : 0;
    
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

// GET reseñas por usuario
resenaProductoController.getResenasByUsuario = async (req, res) => {
  try {
    const { id_user } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id_user)) {
      return res.status(400).json({
        success: false,
        message: "ID de usuario no válido"
      });
    }

    const resenas = await ResenaProducto.find({ 
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
resenaProductoController.marcarUtil = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de reseña no válido"
      });
    }

    const resena = await ResenaProducto.findById(id);
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
      data: { util: resena.util }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al marcar la reseña como útil",
      error: error.message
    });
  }
};

// PUT - Agregar respuesta del vendedor
resenaProductoController.agregarRespuestaVendedor = async (req, res) => {
  try {
    const { id } = req.params;
    const { respuesta } = req.body;

    if (!respuesta || !respuesta.trim()) {
      return res.status(400).json({
        success: false,
        message: "La respuesta del vendedor es obligatoria"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de reseña no válido"
      });
    }

    const resena = await ResenaProducto.findById(id);
    if (!resena) {
      return res.status(404).json({
        success: false,
        message: "Reseña no encontrada"
      });
    }

    await resena.agregarRespuestaVendedor(respuesta);

    res.status(200).json({
      success: true,
      message: "Respuesta del vendedor agregada exitosamente",
      data: resena
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al agregar respuesta del vendedor",
      error: error.message
    });
  }
};

// PUT - Agregar tag a reseña
resenaProductoController.agregarTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { tag } = req.body;

    if (!tag || !tag.trim()) {
      return res.status(400).json({
        success: false,
        message: "El tag es obligatorio"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de reseña no válido"
      });
    }

    const resena = await ResenaProducto.findById(id);
    if (!resena) {
      return res.status(404).json({
        success: false,
        message: "Reseña no encontrada"
      });
    }

    resena.agregarTag(tag.toLowerCase());
    await resena.save();

    res.status(200).json({
      success: true,
      message: "Tag agregado exitosamente",
      data: { tags: resena.tags }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al agregar tag",
      error: error.message
    });
  }
};

// PUT - Remover tag de reseña
resenaProductoController.removerTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { tag } = req.body;

    if (!tag || !tag.trim()) {
      return res.status(400).json({
        success: false,
        message: "El tag es obligatorio"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de reseña no válido"
      });
    }

    const resena = await ResenaProducto.findById(id);
    if (!resena) {
      return res.status(404).json({
        success: false,
        message: "Reseña no encontrada"
      });
    }

    resena.removerTag(tag.toLowerCase());
    await resena.save();

    res.status(200).json({
      success: true,
      message: "Tag removido exitosamente",
      data: { tags: resena.tags }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al remover tag",
      error: error.message
    });
  }
};

// GET - Obtener reseñas con compra verificada
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