const productsController = {};
import productsModel from "../models/Products.js";
import { v2 as cloudinary } from "cloudinary";
import { config } from "../config.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

console.log('Cloudinary configurado correctamente');

// GET todos los productos
productsController.getProducts = async (req, res) => {
  try {
    const products = await productsModel.find();
    res.json(products);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ message: "Error al obtener productos" });
  }
};

// GET producto por ID
productsController.getProductById = async (req, res) => {
  try {
    const product = await productsModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json(product);
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({ message: "Error al obtener producto" });
  }
};

// Función auxiliar para subir múltiples imágenes a Cloudinary
const uploadMultipleImages = async (files) => {
  const imageUrls = [];

  if (!files || files.length === 0) {
    console.log("No se recibieron archivos de imagen");
    return imageUrls;
  }

  console.log(`Procesando ${files.length} archivos de imagen`);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    try {
      if (!file.path) {
        console.error(`Error: El archivo ${i + 1} no tiene ruta válida`, file);
        continue;
      }

      console.log(`Subiendo imagen ${i + 1} a Cloudinary:`, {
        path: file.path,
        mimetype: file.mimetype,
        size: file.size,
        filename: file.filename
      });

      const result = await cloudinary.uploader.upload(file.path, {
        folder: "Ideart",
        resource_type: "auto",
        allowed_formats: ["jpg", "png", "jpeg", "webp", "tiff"],
        transformation: [{ width: 800, height: 600, crop: "limit" }],
        quality: "auto:good",
        fetch_format: "auto"
      });

      if (result && result.secure_url) {
        imageUrls.push(result.secure_url);
        console.log(`Imagen ${i + 1} subida correctamente:`, {
          url: result.secure_url,
          format: result.format,
          resource_type: result.resource_type
        });
      } else {
        console.error(`Error: Cloudinary no devolvió una URL segura para la imagen ${i + 1}`, result);
      }

    } catch (cloudinaryError) {
      console.error(`Error al subir imagen ${i + 1} a Cloudinary:`, cloudinaryError);
    }
  }

  console.log(`Se subieron ${imageUrls.length} de ${files.length} imágenes correctamente`);
  return imageUrls;
};

// CREATE producto con múltiples imágenes
productsController.createProducts = async (req, res) => {
  try {
    const {
      name,
      productType,
      subType,
      usageCategory,
      color,
      size,
      description,
      stock,
      price,
      material,
      tags
    } = req.body;

    // Validación de campos
    if (
      !name ||
      !productType ||
      !subType ||
      !usageCategory ||
      !color ||
      !size ||
      !description ||
      stock === undefined ||
      price === undefined ||
      !material ||
      !Array.isArray(tags)
    ) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios",
        required: ["name", "productType", "subType", "usageCategory", "color", "size", "description", "stock", "price", "material", "tags"],
        received: { name, productType, subType, usageCategory, color, size, description, stock, price, material, tags }
      });
    }

    // Subir múltiples imágenes a Cloudinary (compatible con uploadFlexible)
    let files = [];
    if (req.files && req.files.images && req.files.images.length > 0) {
      files = req.files.images;
    } else if (req.files && req.files.image && req.files.image.length > 0) {
      files = req.files.image;
    } else if (req.file) {
      files = [req.file];
    }
    const imageUrls = await uploadMultipleImages(files);

    // Crear el objeto del producto
    const newProduct = new productsModel({
      name,
      productType,
      subType,
      usageCategory,
      color,
      size,
      description,
      stock,
      price,
      material,
      tags,
      images: imageUrls // Array de URLs o array vacío
    });

    // Guardar en la base de datos
    const savedProduct = await newProduct.save();
    console.log("Producto guardado correctamente:", savedProduct._id);

    // Responder con éxito
    return res.status(201).json({
      message: "Producto creado con éxito",
      product: savedProduct,
      imagesUploaded: imageUrls.length
    });

  } catch (error) {
    console.error("Error al crear producto:", error);

    // Manejar errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      const validationErrors = {};

      // Extraer los mensajes de error de validación
      for (const field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }

      return res.status(400).json({
        message: "Error de validación",
        errors: validationErrors
      });
    }

    return res.status(500).json({
      message: "Error al crear el producto",
      error: error.message
    });
  }
};

// Función auxiliar para eliminar imágenes de Cloudinary
const deleteCloudinaryImages = async (imageUrls) => {
  if (!imageUrls || imageUrls.length === 0) return;

  for (const imageUrl of imageUrls) {
    try {
      // Extraer el public_id de la URL de Cloudinary
      const publicId = imageUrl.split('/').pop().split('.')[0];
      const folderPublicId = `Ideart/${publicId}`;

      await cloudinary.uploader.destroy(folderPublicId);
      console.log(`Imagen eliminada de Cloudinary: ${folderPublicId}`);
    } catch (error) {
      console.error(`Error al eliminar imagen de Cloudinary: ${imageUrl}`, error);
    }
  }
};

// UPDATE producto
productsController.updateProduct = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const product = await productsModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Si hay nuevas imágenes, subir las nuevas (compatible con uploadFlexible)
    let files = [];
    if (req.files && req.files.images && req.files.images.length > 0) {
      files = req.files.images;
    } else if (req.files && req.files.image && req.files.image.length > 0) {
      files = req.files.image;
    } else if (req.file) {
      files = [req.file];
    }

    if (files.length > 0) {
      // Eliminar las imágenes anteriores de Cloudinary
      if (product.images && product.images.length > 0) {
        await deleteCloudinaryImages(product.images);
      }
      // Subir las nuevas imágenes
      const newImageUrls = await uploadMultipleImages(files);
      updates.images = newImageUrls;
    }

    const updatedProduct = await productsModel.findByIdAndUpdate(id, updates, { new: true });
    res.status(200).json({
      message: "Producto actualizado correctamente",
      product: updatedProduct
    });

  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ message: "Error al actualizar el producto" });
  }
};

// DELETE producto
productsController.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await productsModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Eliminar todas las imágenes de Cloudinary
    if (product.images && product.images.length > 0) {
      await deleteCloudinaryImages(product.images);
    }

    await productsModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Producto eliminado exitosamente" });

  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ message: "Error eliminando el producto" });
  }
};

export default productsController;