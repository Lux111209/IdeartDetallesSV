import Provedores from "../models/Provedores.js";
import mongoose from "mongoose";

const provedoresController = {};

// GET - Obtener todos los proveedores
provedoresController.getProvedores = async (req, res) => {
  try {
    const provedores = await Provedores.find().sort({ nombre: 1 });
    
    res.status(200).json({
      success: true,
      data: provedores,
      count: provedores.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener los proveedores",
      error: error.message
    });
  }
};

// GET - Obtener proveedor por ID
provedoresController.getProvedorById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar que el ID sea válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de proveedor no válido"
      });
    }

    const provedor = await Provedores.findById(id);

    if (!provedor) {
      return res.status(404).json({
        success: false,
        message: "Proveedor no encontrado"
      });
    }

    res.status(200).json({
      success: true,
      data: provedor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener el proveedor",
      error: error.message
    });
  }
};

// POST - Crear un nuevo proveedor
provedoresController.createProvedor = async (req, res) => {
  try {
    const { nombre, productosBrindados, numero, correo, imgProvedor, direccion, activo } = req.body;

    // Validaciones básicas
    if (!nombre || !numero || !correo) {
      return res.status(400).json({
        success: false,
        message: "Nombre, número y correo son campos obligatorios"
      });
    }

    // Validar que productosBrindados sea un array si se proporciona
    let productosArray = productosBrindados || [];
    if (productosArray && !Array.isArray(productosArray)) {
      productosArray = [productosArray];
    }

    // Verificar si ya existe un proveedor con el mismo correo
    const provedorExistente = await Provedores.findOne({ correo: correo.toLowerCase() });
    if (provedorExistente) {
      return res.status(400).json({
        success: false,
        message: "Ya existe un proveedor con este correo electrónico"
      });
    }

    const nuevoProvedor = new Provedores({
      nombre,
      productosBrindados: productosArray,
      numero,
      correo,
      imgProvedor,
      direccion,
      activo: activo !== undefined ? activo : true
    });

    const provedorGuardado = await nuevoProvedor.save();

    res.status(201).json({
      success: true,
      message: "Proveedor creado exitosamente",
      data: provedorGuardado
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Ya existe un proveedor con este correo electrónico"
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Error al crear el proveedor",
      error: error.message
    });
  }
};

// PUT - Actualizar un proveedor por ID
provedoresController.updateProvedor = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, productosBrindados, numero, correo, imgProvedor, direccion, activo } = req.body;

    // Validar que el ID sea válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de proveedor no válido"
      });
    }

    // Verificar si el proveedor existe
    const provedorExistente = await Provedores.findById(id);
    if (!provedorExistente) {
      return res.status(404).json({
        success: false,
        message: "Proveedor no encontrado"
      });
    }

    // Preparar datos de actualización
    const updateData = {};
    
    if (nombre) updateData.nombre = nombre;
    if (numero) updateData.numero = numero;
    if (imgProvedor !== undefined) updateData.imgProvedor = imgProvedor;
    if (direccion !== undefined) updateData.direccion = direccion;
    if (activo !== undefined) updateData.activo = activo;

    // Validar productos si se proporcionan
    if (productosBrindados !== undefined) {
      let productosArray = productosBrindados;
      if (!Array.isArray(productosArray)) {
        productosArray = [productosArray];
      }
      updateData.productosBrindados = productosArray;
    }

    // Validar correo si se actualiza y es diferente al actual
    if (correo && correo.toLowerCase() !== provedorExistente.correo) {
      const correoExistente = await Provedores.findOne({ 
        correo: correo.toLowerCase(),
        _id: { $ne: id }
      });
      if (correoExistente) {
        return res.status(400).json({
          success: false,
          message: "Ya existe otro proveedor con este correo electrónico"
        });
      }
      updateData.correo = correo;
    }

    const provedorActualizado = await Provedores.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Proveedor actualizado exitosamente",
      data: provedorActualizado
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Ya existe un proveedor con este correo electrónico"
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Error al actualizar el proveedor",
      error: error.message
    });
  }
};

// DELETE - Eliminar un proveedor por ID
provedoresController.deleteProvedor = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar que el ID sea válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de proveedor no válido"
      });
    }

    const provedorEliminado = await Provedores.findByIdAndDelete(id);
    
    if (!provedorEliminado) {
      return res.status(404).json({
        success: false,
        message: "Proveedor no encontrado"
      });
    }

    res.status(200).json({
      success: true,
      message: "Proveedor eliminado exitosamente",
      data: provedorEliminado
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar el proveedor",
      error: error.message
    });
  }
};

// GET - Obtener proveedores activos
provedoresController.getProvedoresActivos = async (req, res) => {
  try {
    const provedoresActivos = await Provedores.find({ activo: true })
      .sort({ nombre: 1 });

    res.status(200).json({
      success: true,
      data: provedoresActivos,
      count: provedoresActivos.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener proveedores activos",
      error: error.message
    });
  }
};

// PUT - Agregar producto a proveedor
provedoresController.agregarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { producto } = req.body;

    if (!producto) {
      return res.status(400).json({
        success: false,
        message: "El nombre del producto es obligatorio"
      });
    }

    const provedor = await Provedores.findById(id);
    if (!provedor) {
      return res.status(404).json({
        success: false,
        message: "Proveedor no encontrado"
      });
    }

    provedor.agregarProducto(producto);
    await provedor.save();

    res.status(200).json({
      success: true,
      message: "Producto agregado exitosamente",
      data: provedor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al agregar producto",
      error: error.message
    });
  }
};

// PUT - Remover producto de proveedor
provedoresController.removerProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { producto } = req.body;

    if (!producto) {
      return res.status(400).json({
        success: false,
        message: "El nombre del producto es obligatorio"
      });
    }

    const provedor = await Provedores.findById(id);
    if (!provedor) {
      return res.status(404).json({
        success: false,
        message: "Proveedor no encontrado"
      });
    }

    provedor.removerProducto(producto);
    await provedor.save();

    res.status(200).json({
      success: true,
      message: "Producto removido exitosamente",
      data: provedor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al remover producto",
      error: error.message
    });
  }
};

export default provedoresController;