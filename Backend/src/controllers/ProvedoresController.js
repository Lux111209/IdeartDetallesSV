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
      message: "Error al obtener proveedores",
      error: error.message
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
      message: "Error al obtener proveedor",
      error: error.message
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
        message: "Faltan campos obligatorios: nombre, numero, correo"
      });
    }

    // Validar que nombre no esté vacío
    if (nombre.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "El nombre no puede estar vacío"
      });
    }

    // Validar que numero no esté vacío
    if (numero.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "El número no puede estar vacío"
      });
    }

    // Validar formato básico de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo.trim())) {
      return res.status(400).json({
        success: false,
        message: "Formato de correo inválido"
      });
    }

    // Validar que productosBrindados sea array si se proporciona
    if (productosBrindados && !Array.isArray(productosBrindados)) {
      return res.status(400).json({
        success: false,
        message: "Los productos brindados deben ser un array"
      });
    }

    // Verificar email duplicado
    const existe = await Provedores.findOne({ correo: correo.toLowerCase() });
    if (existe) {
      return res.status(409).json({
        success: false,
        message: "Ya existe un proveedor con este correo"
      });
    }

    // Crear nuevo proveedor
    const nuevoProvedor = new Provedores({
      nombre: nombre.trim(),
      productosBrindados: productosBrindados || [],
      numero: numero.trim(),
      correo: correo.trim().toLowerCase(),
      imgProvedor: imgProvedor ? imgProvedor.trim() : '',
      direccion: direccion ? direccion.trim() : '',
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
      message: "Error al crear proveedor",
      error: error.message
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
    
    // Validar y agregar nombre si se proporciona
    if (nombre) {
      if (nombre.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: "El nombre no puede estar vacío"
        });
      }
      updateData.nombre = nombre.trim();
    }

    // Validar y agregar numero si se proporciona
    if (numero) {
      if (numero.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: "El número no puede estar vacío"
        });
      }
      updateData.numero = numero.trim();
    }

    // Validar y agregar correo si se proporciona
    if (correo) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(correo.trim())) {
        return res.status(400).json({
          success: false,
          message: "Formato de correo inválido"
        });
      }
      updateData.correo = correo.trim().toLowerCase();
    }

    // Validar productosBrindados si se proporciona
    if (productosBrindados) {
      if (!Array.isArray(productosBrindados)) {
        return res.status(400).json({
          success: false,
          message: "Los productos brindados deben ser un array"
        });
      }
      updateData.productosBrindados = productosBrindados;
    }

    if (imgProvedor !== undefined) updateData.imgProvedor = imgProvedor;
    if (direccion !== undefined) updateData.direccion = direccion;
    if (activo !== undefined) updateData.activo = activo;

    // Verificar email duplicado si se está actualizando
    if (correo && correo.toLowerCase() !== existe.correo) {
      const emailExiste = await Provedores.findOne({ 
        correo: correo.toLowerCase(),
        _id: { $ne: id }
      });
      if (emailExiste) {
        return res.status(409).json({
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
      message: "Error al actualizar proveedor",
      error: error.message
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
      message: "Error al eliminar proveedor",
      error: error.message
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
      message: "Error al obtener proveedores activos",
      error: error.message
    });
  }
};

// PUT - Agregar producto a la lista del proveedor
provedoresController.agregarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { producto } = req.body;

    // Validar ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID no válido"
      });
    }

    // Validar producto
    if (!producto) {
      return res.status(400).json({
        success: false,
        message: "El producto es obligatorio"
      });
    }

    // Validar que producto no esté vacío
    if (producto.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "El producto no puede estar vacío"
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

    const productoLimpio = producto.trim();

    // Verificar si el producto ya existe
    if (provedor.productosBrindados.includes(productoLimpio)) {
      return res.status(409).json({
        success: false,
        message: "El producto ya está en la lista del proveedor"
      });
    }

    // Agregar producto si no existe ya
    provedor.productosBrindados.push(productoLimpio);
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
      message: "Error al agregar producto",
      error: error.message
    });
  }
};

// PUT - Remover producto de la lista del proveedor
provedoresController.removerProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { producto } = req.body;

    // Validar ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID no válido"
      });
    }

    // Validar producto
    if (!producto) {
      return res.status(400).json({
        success: false,
        message: "El producto es obligatorio"
      });
    }

    // Validar que producto no esté vacío
    if (producto.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "El producto no puede estar vacío"
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

    const productoLimpio = producto.trim();

    // Verificar si el producto existe en la lista
    if (!provedor.productosBrindados.includes(productoLimpio)) {
      return res.status(404).json({
        success: false,
        message: "El producto no está en la lista del proveedor"
      });
    }

    // Remover producto de la lista
    provedor.productosBrindados = provedor.productosBrindados.filter(p => p !== productoLimpio);
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
      message: "Error al remover producto",
      error: error.message
    });
  }
};

// GET - Buscar proveedores por producto
provedoresController.getProvedoresByProducto = async (req, res) => {
  try {
    const { producto } = req.params;

    // Validar que producto no esté vacío
    if (!producto || producto.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "El producto es requerido"
      });
    }

    // Buscar proveedores que ofrecen el producto
    const proveedores = await Provedores.find({ 
      productosBrindados: producto.trim(),
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
      message: "Error al buscar proveedores por producto",
      error: error.message
    });
  }
};

export default provedoresController;