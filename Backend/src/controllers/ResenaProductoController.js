const resenaProductoController = {};
import ResenaProducto from "../models/ResenaProducto.js";
import { v2 as cloudinary } from "cloudinary";

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

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
      const publicId = imageUrl.split('/').pop().split('.')[0];
      const folderPublicId = `ResenasProducto/${publicId}`;
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
    const resenas = await ResenaProducto.find();
    res.json(resenas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener reseñas de producto" });
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
      respuestaVendedor
    } = req.body;

    // Obtener archivos de imágenes desde multer (campo 'img' como array)
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
      compraVerificada,
      img: imgUrls,
      respuestaVendedor
    });

    const savedResena = await nuevaResena.save();
    res.status(201).json({
      message: "Reseña de producto guardada",
      resena: savedResena,
      imagesUploaded: imgUrls.length
    });
  } catch (error) {
    res.status(500).json({ message: "Error al crear la reseña de producto", error: error.message });
  }
};

// UPDATE reseña de producto (y actualizar imágenes si se envían nuevas)
resenaProductoController.updateResenaProducto = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const resena = await ResenaProducto.findById(id);
    if (!resena) {
      return res.status(404).json({ message: "Reseña de producto no encontrada" });
    }

    // Si hay nuevas imágenes, subirlas y eliminar las anteriores
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
      updates.img = newImgUrls;
    }

    const updatedResena = await ResenaProducto.findByIdAndUpdate(id, updates, { new: true });
    res.status(200).json({
      message: "Reseña de producto actualizada",
      resena: updatedResena
    });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la reseña de producto", error: error.message });
  }
};

// DELETE reseña de producto
resenaProductoController.deleteResenaProducto = async (req, res) => {
  const { id } = req.params;
  try {
    const resena = await ResenaProducto.findById(id);
    if (!resena) {
      return res.status(404).json({ message: "Reseña de producto no encontrada" });
    }

    // Eliminar imágenes de Cloudinary
    if (resena.img && resena.img.length > 0) {
      await deleteCloudinaryImages(resena.img);
    }

    await ResenaProducto.findByIdAndDelete(id);
    res.status(200).json({ message: "Reseña de producto eliminada" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la reseña de producto", error: error.message });
  }
};

export default resenaProductoController;