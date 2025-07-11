import productsModel from "../models/Products.js";
import { v2 as cloudinary } from "cloudinary";
import { config } from "../../config.js";

// Configurar Cloudinary

console.log("Cloudinary Config Values:");
console.log("cloud_name:", config.CLOUDINARY.CLOUD_NAME);
console.log("api_key:", config.CLOUDINARY.API_KEY);
console.log("api_secret:", config.CLOUDINARY.API_SECRET);

cloudinary.config({
  cloud_name: config.CLOUDINARY.CLOUD_NAME,
  api_key: config.CLOUDINARY.API_KEY,
  api_secret: config.CLOUDINARY.API_SECRET,
  secure: true
});

const productsController = {};

// SELECT Products
productsController.getAllProducts = async (req, res) => {
  try {
    const products = await productsModel.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// SELECT product
productsController.getProductById = async (req, res) => {
  try {
    const product = await productsModel.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// INSERT Products
// INSERT Product
productsController.insertProduct = async (req, res) => {
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

    // Asegurarse de que tags sea un array
    let tagsArray = tags;
    if (tagsArray && !Array.isArray(tagsArray)) {
      tagsArray = [tagsArray];
    }

    let imagesURL = [];

    // Subir todas las imágenes a Cloudinary
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map(file =>
        cloudinary.uploader.upload(file.path, {
          folder: "products",
          allowed_formats: ["jpg", "png", "jpeg", "pdf", "tiff"],
        })
      );
      const results = await Promise.all(uploadPromises);
      imagesURL = results.map(result => result.secure_url);
    }

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
      tags: tagsArray,
      images: imagesURL
    });

    await newProduct.save();

    res.status(201).json({ message: "Product created", product: newProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE prtoducts
productsController.updateProduct = async (req, res) => {
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

  
  let tagsArray = tags;
  if (tagsArray && !Array.isArray(tagsArray)) {
    tagsArray = [tagsArray];
  }

  let imagesURL = [];

  // Subir nuevas imágenes a Cloudinary 
  if (req.files && req.files.length > 0) {
    const uploadPromises = req.files.map(file =>
      cloudinary.uploader.upload(file.path, {
        folder: "products",
        allowed_formats: ["jpg", "png", "jpeg", "pdf", "tiff"],
      })
    );
    const results = await Promise.all(uploadPromises);
    imagesURL = results.map(result => result.secure_url);
  }

  // Construir el objetoo
  const updateData = {
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
    tags: tagsArray
  };

  // Solo actualizar imágenes si se enviaron nuevas
  if (imagesURL.length > 0) {
    updateData.images = imagesURL;
  }

  const updatedProduct = await productsModel.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true }
  );

  res.json({ message: "Product updated", product: updatedProduct });
};

// DELETE products
productsController.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await productsModel.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted", product: deletedProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default productsController;