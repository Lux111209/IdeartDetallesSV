import Provedores from "../models/Provedores.js";
import mongoose from "mongoose";

const provedoresController = {};

// GET - Obtener todos los proveedores
provedoresController.getProvedores = async (req, res) => {
  try {
    // Buscar todos los proveedores ordenados por nombre
    const provedores = await Provedores.find().sort({ nombre: 1 });
    
    // Respuesta exitosa
    res.json({
      success: true,
      data: provedores
    });
  } catch (error) {
    // Manejo de errores
    res.status(500).json({
      success: false,
      message: "Error al obtener proveedores"
    });
  }
};

// GET - Obtener proveedor por ID
provedoresController.getProvedorById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validar ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID no válido"
      });
    }

    // Buscar proveedor por ID
    const provedor = await Provedores.findById(id);

    // Verificar si existe
    if (!provedor) {
      return res.status(404).json({
        success: false,
        message: "Proveedor no encontrado"
      });
    }

    // Respuesta exitosa
    res.json({
      success: true,
      data: provedor
    });
  } catch (error) {
    // Manejo de errores
    res.status(500).json({
      success: false,
      message: "Error al obtener proveedor"
    });
  }
};

// POST - Crear nuevo proveedor
provedoresController.createProvedor = async (req, res) => {
  try {
    const { nombre, productosBrindados, numero, correo, imgProvedor, direccion, activo } = req.body;

    // Validar campos obligatorios
    if (!nombre || !numero || !correo) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos obligatorios"
      });
    }

    // Verificar email duplicado
    const existe = await Provedores.findOne({ correo: correo.toLowerCase() });
    if (existe) {
      return res.status(400).json({
        success: false,
        message: "Ya existe un proveedor con este correo"
      });
    }

    // Crear nuevo proveedor
    const nuevoProvedor = new Provedores({
      nombre,
      productosBrindados: productosBrindados || [],
      numero,
      correo,
      imgProvedor,
      direccion,
      activo: activo !== undefined ? activo : true
    });

    // Guardar en base de datos
    const guardado = await nuevoProvedor.save();

    // Respuesta exitosa
    res.status(201).json({
      success: true,
      data: guardado
    });
  } catch (error) {
    // Manejo de errores (incluyendo duplicados por índice único)
    res.status(500).json({
      success: false,
      message: "Error al crear proveedor"
    });
  }
};

// PUT - Actualizar proveedor
provedoresController.updateProvedor = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, productosBrindados, numero, correo, imgProvedor, direccion, activo } = req.body;

    // Validar ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID no válido"
      });
    }

    // Verificar si existe el proveedor
    const existe = await Provedores.findById(id);
    if (!existe) {
      return res.status(404).json({
        success: false,
        message: "Proveedor no encontrado"
      });
    }

    // Preparar datos de actualización
    const updateData = {};
    if (nombre) updateData.nombre = nombre;
    if (numero) updateData.numero = numero;
    if (correo) updateData.correo = correo;
    if (imgProvedor !== undefined) updateData.imgProvedor = imgProvedor;
    if (direccion !== undefined) updateData.direccion = direccion;
    if (activo !== undefined) updateData.activo = activo;
    if (productosBrindados) updateData.productosBrindados = productosBrindados;

    // Verificar email duplicado si se está actualizando
    if (correo && correo.toLowerCase() !== existe.correo) {
      const emailExiste = await Provedores.findOne({ 
        correo: correo.toLowerCase(),
        _id: { $ne: id }
      });
      if (emailExiste) {
        return res.status(400).json({
          success: false,
          message: "Ya existe otro proveedor con este correo"
        });
      }
    }

    // Actualizar en base de datos
    const actualizado = await Provedores.findByIdAndUpdate(id, updateData, { new: true });

    // Respuesta exitosa
    res.json({
      success: true,
      data: actualizado
    });
  } catch (error) {
    // Manejo de errores
    res.status(500).json({
      success: false,
      message: "Error al actualizar proveedor"
    });
  }
};

// DELETE - Eliminar proveedor
provedoresController.deleteProvedor = async (req, res) => {
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
    const eliminado = await Provedores.findByIdAndDelete(id);
    
    // Verificar si existía
    if (!eliminado) {
      return res.status(404).json({
        success: false,
        message: "Proveedor no encontrado"
      });
    }

    // Respuesta exitosa
    res.json({
      success: true,
      message: "Proveedor eliminado"
    });
  } catch (error) {
    // Manejo de errores
    res.status(500).json({
      success: false,
      message: "Error al eliminar proveedor"
    });
  }
};

// GET - Obtener solo proveedores activos
provedoresController.getProvedoresActivos = async (req, res) => {
  try {
    // Buscar proveedores activos ordenados por nombre
    const activos = await Provedores.find({ activo: true }).sort({ nombre: 1 });

    // Respuesta exitosa
    res.json({
      success: true,
      data: activos
    });
  } catch (error) {
    // Manejo de errores
    res.status(500).json({
      success: false,
      message: "Error al obtener proveedores activos"
    });
  }
};

// PUT - Agregar producto a la lista del proveedor
provedoresController.agregarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { producto } = req.body;

    // Validar producto
    if (!producto) {
      return res.status(400).json({
        success: false,
        message: "El producto es obligatorio"
      });
    }

    // Buscar proveedor
    const provedor = await Provedores.findById(id);
    if (!provedor) {
      return res.status(404).json({
        success: false,
        message: "Proveedor no encontrado"
      });
    }

    // Agregar producto si no existe ya
    if (!provedor.productosBrindados.includes(producto)) {
      provedor.productosBrindados.push(producto);
      await provedor.save();
    }

    // Respuesta exitosa
    res.json({
      success: true,
      data: provedor
    });
  } catch (error) {
    // Manejo de errores
    res.status(500).json({
      success: false,
      message: "Error al agregar producto"
    });
  }
};

// PUT - Remover producto de la lista del proveedor
provedoresController.removerProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { producto } = req.body;

    // Validar producto
    if (!producto) {
      return res.status(400).json({
        success: false,
        message: "El producto es obligatorio"
      });
    }

    // Buscar proveedor
    const provedor = await Provedores.findById(id);
    if (!provedor) {
      return res.status(404).json({
        success: false,
        message: "Proveedor no encontrado"
      });
    }

    // Remover producto de la lista
    provedor.productosBrindados = provedor.productosBrindados.filter(p => p !== producto);
    await provedor.save();

    // Respuesta exitosa
    res.json({
      success: true,
      data: provedor
    });
  } catch (error) {
    // Manejo de errores
    res.status(500).json({
      success: false,
      message: "Error al remover producto"
    });
  }
};

// GET - Buscar proveedores por producto
provedoresController.getProvedoresByProducto = async (req, res) => {
  try {
    const { producto } = req.params;

    // Buscar proveedores que ofrecen el producto
    const proveedores = await Provedores.find({ 
      productosBrindados: producto,
      activo: true 
    }).sort({ nombre: 1 });

    // Respuesta exitosa
    res.json({
      success: true,
      data: proveedores,
      total: proveedores.length
    });
  } catch (error) {
    // Manejo de errores
    res.status(500).json({
      success: false,
      message: "Error al buscar proveedores por producto"
    });
  }
};

export default provedoresController;