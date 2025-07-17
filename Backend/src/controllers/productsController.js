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

// Mapeo de categorías para compatibilidad con Offers
const categoryMapping = {
  'Ropa': 'clothing',
  'Camisas': 'clothing',
  'Pantalones': 'clothing',
  'Vestidos': 'clothing',
  'Accesorios': 'electronics',
  'Tecnología': 'electronics',
  'Electrónicos': 'electronics',
  'Celulares': 'electronics',
  'Computadoras': 'electronics',
  'Hogar': 'home',
  'Muebles': 'home',
  'Decoración': 'home',
  'Cocina': 'home',
  'Libros': 'books',
  'Literatura': 'books',
  'Educación': 'books',
  'Deportes': 'sports',
  'Fitness': 'sports',
  'Aire libre': 'sports',
  'Belleza': 'beauty',
  'Cosméticos': 'beauty',
  'Cuidado personal': 'beauty',
  'Juguetes': 'toys',
  'Infantil': 'toys',
  'Bebés': 'toys',
  'Alimentos': 'food',
  'Bebidas': 'food',
  'Comida': 'food'
};

// Función para mapear categoría
const mapCategory = (productType) => {
  if (!productType) return 'electronics'; // categoría por defecto
  
  // Buscar coincidencia exacta primero
  if (categoryMapping[productType]) {
    return categoryMapping[productType];
  }
  
  // Buscar coincidencia parcial
  const lowerProductType = productType.toLowerCase();
  for (const [key, value] of Object.entries(categoryMapping)) {
    if (lowerProductType.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerProductType)) {
      return value;
    }
  }
  
  // Si no hay coincidencia, devolver categoría por defecto
  return 'electronics';
};

// SELECT Products - Mejorado con formato para frontend
productsController.getAllProducts = async (req, res) => {
  try {
    const products = await productsModel.find();
    
    // Formatear productos para el frontend
    const formattedProducts = products.map(product => ({
      ...product.toObject(),
      // Agregar campos calculados para compatibilidad
      category: mapCategory(product.productType),
      originalPrice: product.price,
      discount: 0,
      featured: false,
      orders: Math.floor(Math.random() * 50),
      rating: (Math.random() * 2 + 3).toFixed(1),
      reviews: Math.floor(Math.random() * 30) + 5,
      published: product.createdAt || new Date()
    }));
    
    res.json({
      success: true,
      data: formattedProducts
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// SELECT product by ID
productsController.getProductById = async (req, res) => {
  try {
    const product = await productsModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: "Product not found" 
      });
    }
    
    // Formatear producto individual
    const formattedProduct = {
      ...product.toObject(),
      category: mapCategory(product.productType),
      originalPrice: product.price,
      discount: 0,
      featured: false,
      orders: Math.floor(Math.random() * 50),
      rating: (Math.random() * 2 + 3).toFixed(1),
      reviews: Math.floor(Math.random() * 30) + 5,
      published: product.createdAt || new Date()
    };
    
    res.json({
      success: true,
      data: formattedProduct
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// INSERT Product - Mejorado con validaciones
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

    // Validaciones básicas
    if (!name || !productType || !price) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos obligatorios: name, productType, price"
      });
    }

    if (price < 0) {
      return res.status(400).json({
        success: false,
        message: "El precio debe ser mayor a 0"
      });
    }

    if (stock < 0) {
      return res.status(400).json({
        success: false,
        message: "El stock debe ser mayor o igual a 0"
      });
    }

    // Asegurarse de que tags sea un array
    let tagsArray = tags;
    if (tagsArray && !Array.isArray(tagsArray)) {
      tagsArray = [tagsArray];
    }

    let imagesURL = [];

    // Subir todas las imágenes a Cloudinary
    if (req.files && req.files.length > 0) {
      try {
        const uploadPromises = req.files.map(file =>
          cloudinary.uploader.upload(file.path, {
            folder: "products",
            allowed_formats: ["jpg", "png", "jpeg", "pdf", "tiff"],
          })
        );
        const results = await Promise.all(uploadPromises);
        imagesURL = results.map(result => result.secure_url);
      } catch (uploadError) {
        console.error('Error uploading images:', uploadError);
        // Continuar sin imágenes si falla la subida
        imagesURL = [];
      }
    }

    const newProduct = new productsModel({
      name: name.trim(),
      productType: productType.trim(),
      subType: subType ? subType.trim() : '',
      usageCategory: usageCategory ? usageCategory.trim() : '',
      color: color ? color.trim() : '',
      size: size ? size.trim() : '',
      description: description ? description.trim() : '',
      stock: parseInt(stock) || 0,
      price: parseFloat(price),
      material: material ? material.trim() : '',
      tags: tagsArray || [],
      images: imagesURL
    });

    const savedProduct = await newProduct.save();

    // Formatear respuesta
    const formattedProduct = {
      ...savedProduct.toObject(),
      category: mapCategory(savedProduct.productType),
      originalPrice: savedProduct.price,
      discount: 0,
      featured: false,
      orders: 0,
      rating: "0.0",
      reviews: 0,
      published: savedProduct.createdAt
    };

    res.status(201).json({ 
      success: true,
      message: "Product created", 
      data: formattedProduct 
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// UPDATE products - Mejorado
productsController.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    
    // Verificar que el producto existe
    const existingProduct = await productsModel.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado"
      });
    }

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

    // Validaciones
    if (price !== undefined && price < 0) {
      return res.status(400).json({
        success: false,
        message: "El precio debe ser mayor a 0"
      });
    }

    if (stock !== undefined && stock < 0) {
      return res.status(400).json({
        success: false,
        message: "El stock debe ser mayor o igual a 0"
      });
    }

    let tagsArray = tags;
    if (tagsArray && !Array.isArray(tagsArray)) {
      tagsArray = [tagsArray];
    }

    let imagesURL = existingProduct.images || [];

    // Subir nuevas imágenes a Cloudinary si las hay
    if (req.files && req.files.length > 0) {
      try {
        const uploadPromises = req.files.map(file =>
          cloudinary.uploader.upload(file.path, {
            folder: "products",
            allowed_formats: ["jpg", "png", "jpeg", "pdf", "tiff"],
          })
        );
        const results = await Promise.all(uploadPromises);
        imagesURL = results.map(result => result.secure_url);
      } catch (uploadError) {
        console.error('Error uploading images:', uploadError);
        // Mantener imágenes existentes si falla la subida
      }
    }

    // Construir objeto de actualización
    const updateData = {};
    
    if (name !== undefined) updateData.name = name.trim();
    if (productType !== undefined) updateData.productType = productType.trim();
    if (subType !== undefined) updateData.subType = subType.trim();
    if (usageCategory !== undefined) updateData.usageCategory = usageCategory.trim();
    if (color !== undefined) updateData.color = color.trim();
    if (size !== undefined) updateData.size = size.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (stock !== undefined) updateData.stock = parseInt(stock);
    if (price !== undefined) updateData.price = parseFloat(price);
    if (material !== undefined) updateData.material = material.trim();
    if (tagsArray !== undefined) updateData.tags = tagsArray;
    if (imagesURL.length > 0) updateData.images = imagesURL;

    const updatedProduct = await productsModel.findByIdAndUpdate(
      productId,
      updateData,
      { new: true }
    );

    // Formatear respuesta
    const formattedProduct = {
      ...updatedProduct.toObject(),
      category: mapCategory(updatedProduct.productType),
      originalPrice: updatedProduct.price,
      discount: 0,
      featured: false,
      orders: Math.floor(Math.random() * 50),
      rating: (Math.random() * 2 + 3).toFixed(1),
      reviews: Math.floor(Math.random() * 30) + 5,
      published: updatedProduct.createdAt
    };

    res.json({ 
      success: true,
      message: "Product updated", 
      data: formattedProduct 
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// DELETE products - Mejorado
productsController.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await productsModel.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ 
        success: false,
        message: "Product not found" 
      });
    }
    
    res.json({ 
      success: true,
      message: "Product deleted", 
      data: deletedProduct 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// GET products by category - Nueva función para Offers
productsController.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    // Encontrar todos los productTypes que mapean a esta categoría
    const matchingProductTypes = [];
    for (const [productType, mappedCategory] of Object.entries(categoryMapping)) {
      if (mappedCategory === category) {
        matchingProductTypes.push(productType);
      }
    }
    
    // Buscar productos que coincidan con cualquiera de estos tipos
    const products = await productsModel.find({
      productType: { $in: matchingProductTypes }
    });
    
    // Formatear productos
    const formattedProducts = products.map(product => ({
      ...product.toObject(),
      category: mapCategory(product.productType),
      originalPrice: product.price,
      discount: 0,
      featured: false,
      orders: Math.floor(Math.random() * 50),
      rating: (Math.random() * 2 + 3).toFixed(1),
      reviews: Math.floor(Math.random() * 30) + 5,
      published: product.createdAt || new Date()
    }));
    
    res.json({
      success: true,
      data: formattedProducts
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// GET categories - Nueva función para listar categorías disponibles
productsController.getCategories = async (req, res) => {
  try {
    // Obtener todos los productTypes únicos de la base de datos
    const productTypes = await productsModel.distinct('productType');
    
    // Mapear a las categorías del frontend
    const categories = [...new Set(productTypes.map(type => mapCategory(type)))];
    
    // Contar productos por categoría
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const matchingProductTypes = [];
        for (const [productType, mappedCategory] of Object.entries(categoryMapping)) {
          if (mappedCategory === category) {
            matchingProductTypes.push(productType);
          }
        }
        
        const count = await productsModel.countDocuments({
          productType: { $in: matchingProductTypes }
        });
        
        return {
          id: category,
          name: category,
          count: count
        };
      })
    );
    
    res.json({
      success: true,
      data: categoriesWithCount.filter(cat => cat.count > 0)
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

export default productsController;