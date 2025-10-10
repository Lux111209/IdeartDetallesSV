import ventasModel from "../models/Ventas.js";
import mongoose from "mongoose";
import carritoModel from "../models/CarritoCompra.js";

const ventasController = {};

// Obtener todas las ventas
ventasController.getallVenta = async (req, res) => {
    try {
        const ventas = await ventasModel.find()
            .populate("idShoppingCart")
            .sort({ createdAt: -1 });

        console.log('Ventas obtenidas exitosamente:', ventas.length);

        const ventasFormateadas = ventas.map(venta => {
            const ventaObj = venta.toObject();
            
            return {
                ...ventaObj,
                clienteNombre: 'Cliente Anónimo',
                clienteEmail: 'sin-email@ejemplo.com',
                totalProductos: ventaObj.idShoppingCart?.productos?.length || 0,
                fechaFormateada: new Date(ventaObj.createdAt || Date.now()).toLocaleDateString(),
                statusTransaccion: ventaObj.statusTransaccion || 'pendiente',
                statusPago: ventaObj.statusPago || 'pendiente'
            };
        });

        res.status(200).json({
            success: true,
            data: ventasFormateadas,
            total: ventasFormateadas.length
        });

    } catch (error) {
        console.error('Error obteniendo ventas:', error);
        res.status(500).json({
            success: false,
            message: "Error al obtener las ventas",
            error: error.message,
        });
    }
};

// Obtener una venta por ID
ventasController.getVentaByiD = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "ID de venta inválido"
            });
        }

        const venta = await ventasModel.findById(id)
            .populate("idShoppingCart");

        if (!venta) {
            return res.status(404).json({
                success: false,
                message: "Venta no encontrada"
            });
        }

        const ventaFormateada = {
            ...venta.toObject(),
            clienteNombre: 'Cliente Anónimo',
            clienteEmail: 'sin-email@ejemplo.com',
            totalProductos: venta.idShoppingCart?.productos?.length || 0,
            fechaFormateada: new Date(venta.createdAt || Date.now()).toLocaleDateString()
        };

        res.status(200).json({
            success: true,
            data: ventaFormateada
        });

    } catch (error) {
        console.error('Error obteniendo venta:', error);
        res.status(500).json({
            success: false,
            message: "Error buscando la venta",
            error: error.message,
        });
    }
};

// Crear una nueva venta
ventasController.createVenta = async (req, res) => {
    const {
        idShoppingCart,
        direction,
        metodoPago,
        statusPago,
        statusTransaccion,
    } = req.body;

    try {
        if (!idShoppingCart || !direction || !metodoPago) {
            return res.status(400).json({
                success: false,
                message: "Falta información necesaria: (ID del carrito, dirección y método de pago)",
            });
        }

        const carrito = await carritoModel.findById(idShoppingCart);
        if (!carrito) {
            return res.status(404).json({
                success: false,
                message: "El carrito no fue encontrado"
            });
        }

        const newVenta = new ventasModel({
            idShoppingCart,
            direction: direction.trim(),
            metodoPago: metodoPago.trim(),
            statusPago: statusPago || 'pendiente',
            statusTransaccion: statusTransaccion || 'pendiente',
        });

        const ventaGuardada = await newVenta.save();

        const ventaCompleta = await ventasModel.findById(ventaGuardada._id)
            .populate("idShoppingCart");

        console.log(`Nueva venta creada: ${ventaGuardada._id}`);

        res.status(201).json({
            success: true,
            message: "Venta creada con éxito",
            data: ventaCompleta,
        });

    } catch (error) {
        console.error('Error creando venta:', error);
        res.status(400).json({
            success: false,
            message: "Error al crear la venta",
            error: error.message,
        });
    }
};

// ACTUALIZAR VENTA - VERSIÓN SIMPLIFICADA QUE FUNCIONA
ventasController.updateVenta = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        console.log('Actualizando venta ID:', id);
        console.log('Datos recibidos:', updateData);

        // Validar ID
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            console.log('ID inválido:', id);
            return res.status(400).json({
                success: false,
                message: "ID de venta inválido"
            });
        }

        // Verificar que la venta existe
        const ventaExistente = await ventasModel.findById(id);
        if (!ventaExistente) {
            console.log('Venta no encontrada para ID:', id);
            return res.status(404).json({
                success: false,
                message: "Venta no encontrada"
            });
        }

        console.log('Venta encontrada:', ventaExistente._id);

        // Preparar datos de actualización - solo campos permitidos
        const datosLimpios = {};
        
        if (updateData.statusTransaccion !== undefined) {
            datosLimpios.statusTransaccion = updateData.statusTransaccion;
        }
        
        if (updateData.statusPago !== undefined) {
            datosLimpios.statusPago = updateData.statusPago;
        }
        
        if (updateData.direction !== undefined) {
            datosLimpios.direction = updateData.direction;
        }
        
        if (updateData.metodoPago !== undefined) {
            datosLimpios.metodoPago = updateData.metodoPago;
        }

        console.log('Datos a actualizar:', datosLimpios);

        // Verificar que hay algo que actualizar
        if (Object.keys(datosLimpios).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No hay datos válidos para actualizar"
            });
        }

        // Realizar la actualización
        const ventaActualizada = await ventasModel.findByIdAndUpdate(
            id,
            { $set: datosLimpios },
            { 
                new: true,
                runValidators: false // Desactivar validaciones complejas
            }
        ).populate("idShoppingCart");

        if (!ventaActualizada) {
            console.log('Error en la actualización');
            return res.status(500).json({
                success: false,
                message: "Error al actualizar la venta"
            });
        }

        console.log('Venta actualizada exitosamente:', ventaActualizada._id);
        console.log('Nuevos valores:', {
            statusTransaccion: ventaActualizada.statusTransaccion,
            statusPago: ventaActualizada.statusPago
        });

        res.status(200).json({
            success: true,
            message: "Venta actualizada con éxito",
            data: ventaActualizada
        });

    } catch (error) {
        console.error('Error completo actualizando venta:', error);
        console.error('Stack trace:', error.stack);
        
        res.status(500).json({
            success: false,
            message: "Error interno del servidor",
            error: error.message
        });
    }
};

// Eliminar una venta por ID
ventasController.deleteVenta = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "ID de venta inválido"
            });
        }

        const deletedVenta = await ventasModel.findByIdAndDelete(id);
        
        if (!deletedVenta) {
            return res.status(404).json({
                success: false,
                message: "Venta no encontrada"
            });
        }

        console.log(`Venta eliminada: ${id}`);

        res.status(200).json({
            success: true,
            message: "Venta eliminada con éxito",
            data: deletedVenta
        });

    } catch (error) {
        console.error('Error eliminando venta:', error);
        res.status(400).json({
            success: false,
            message: "Error al eliminar la venta",
            error: error.message,
        });
    }
};

// Obtener estadísticas de ventas
ventasController.getEstadisticas = async (req, res) => {
    try {
        const totalVentas = await ventasModel.countDocuments();
        const ventasPendientes = await ventasModel.countDocuments({ statusTransaccion: 'pendiente' });
        const ventasCompletadas = await ventasModel.countDocuments({ statusTransaccion: 'completado' });
        const ventasCanceladas = await ventasModel.countDocuments({ statusTransaccion: 'cancelado' });
        const pagosPendientes = await ventasModel.countDocuments({ statusPago: 'pendiente' });

        res.status(200).json({
            success: true,
            data: {
                totalVentas,
                ventasPendientes,
                ventasCompletadas,
                ventasCanceladas,
                pagosPendientes
            }
        });

    } catch (error) {
        console.error('Error obteniendo estadísticas:', error);
        res.status(500).json({
            success: false,
            message: "Error al obtener estadísticas",
            error: error.message
        });
    }
};

// Obtener ventas por estado
ventasController.getVentasByEstado = async (req, res) => {
    try {
        const { estado } = req.params;
        
        const estadosValidos = ['pendiente', 'en_proceso', 'completado', 'cancelado'];
        if (!estadosValidos.includes(estado)) {
            return res.status(400).json({
                success: false,
                message: "Estado inválido. Valores válidos: " + estadosValidos.join(', ')
            });
        }

        const ventas = await ventasModel.find({ statusTransaccion: estado })
            .populate("idShoppingCart")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: ventas,
            total: ventas.length
        });

    } catch (error) {
        console.error('Error obteniendo ventas por estado:', error);
        res.status(500).json({
            success: false,
            message: "Error al obtener ventas por estado",
            error: error.message
        });
    }
};

export default ventasController;