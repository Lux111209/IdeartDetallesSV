import personalizedModel from "../models/PersonalizedProducts.js";

const personalizedProductsController = {};

// 📋 OBTENER TODAS LAS SOLICITUDES - SÚPER SIMPLE
personalizedProductsController.getAllPersonalizedProducts = async (req, res) => {
    try {
        console.log('🔄 Obteniendo productos personalizados...');
        
        const products = await personalizedModel.find().sort({ createdAt: -1 });
        
        console.log(`✅ Encontrados ${products.length} productos`);
        
        res.status(200).json({
            success: true,
            data: products,
            total: products.length
        });
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        
        res.status(500).json({
            success: false,
            message: "Error al obtener productos",
            error: error.message
        });
    }
};

// 📋 OBTENER POR ID - SÚPER SIMPLE  
personalizedProductsController.getPersonalzizedProdcutById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🔍 Buscando producto ID: ${id}`);
        
        const product = await personalizedModel.findById(id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Producto no encontrado"
            });
        }
        
        res.status(200).json({
            success: true,
            data: product
        });
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        
        res.status(500).json({
            success: false,
            message: "Error al obtener producto",
            error: error.message
        });
    }
};

// ✅ CREAR PRODUCTO - SÚPER SIMPLE
personalizedProductsController.insertPersonalizedProduct = async (req, res) => {
    try {
        console.log('📝 Creando nuevo producto...');
        console.log('📦 Datos recibidos:', req.body);
        
        const newProduct = new personalizedModel(req.body);
        const savedProduct = await newProduct.save();
        
        console.log(`✅ Producto creado con ID: ${savedProduct._id}`);
        
        res.status(201).json({
            success: true,
            message: "Producto creado exitosamente",
            data: savedProduct
        });
        
    } catch (error) {
        console.error('❌ Error creando:', error.message);
        
        res.status(500).json({
            success: false,
            message: "Error al crear producto",
            error: error.message
        });
    }
};

// 🎯 ACTUALIZAR ESTADO - SÚPER SIMPLE
personalizedProductsController.updateEstadoSolicitud = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        console.log(`🔄 Actualizando producto ID: ${id}`);
        console.log('📝 Datos de actualización:', updateData);
        
        const updatedProduct = await personalizedModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: false }
        );
        
        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: "Producto no encontrado"
            });
        }
        
        console.log(`✅ Producto actualizado: ${id}`);
        
        res.status(200).json({
            success: true,
            message: "Producto actualizado exitosamente",
            data: updatedProduct
        });
        
    } catch (error) {
        console.error('❌ Error actualizando:', error.message);
        
        res.status(500).json({
            success: false,
            message: "Error al actualizar",
            error: error.message
        });
    }
};

// ✏️ ACTUALIZAR PRODUCTO COMPLETO - SÚPER SIMPLE
personalizedProductsController.updatePersonalizedProduct = async (req, res) => {
    try {
        const { id } = req.params;
        
        console.log(`🔄 Actualizando producto completo ID: ${id}`);
        
        const updatedProduct = await personalizedModel.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );
        
        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: "Producto no encontrado"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Producto actualizado",
            data: updatedProduct
        });
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        
        res.status(500).json({
            success: false,
            message: "Error al actualizar producto",
            error: error.message
        });
    }
};

// 🗑️ ELIMINAR PRODUCTO - SÚPER SIMPLE
personalizedProductsController.deletePersonalizedProduct = async (req, res) => {
    try {
        const { id } = req.params;
        
        console.log(`🗑️ Eliminando producto ID: ${id}`);
        
        const deletedProduct = await personalizedModel.findByIdAndDelete(id);
        
        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                message: "Producto no encontrado"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Producto eliminado exitosamente"
        });
        
    } catch (error) {
        console.error('❌ Error eliminando:', error.message);
        
        res.status(500).json({
            success: false,
            message: "Error al eliminar producto",
            error: error.message
        });
    }
};

export default personalizedProductsController;