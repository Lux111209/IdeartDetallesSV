import ventasModel from "../models/Ventas.js";
import mongoose from "mongoose";
import carritoModel from "../models/CarritoCompra.js";

const ventasController = {};

// Obtener todas las ventas - VERSIÓN SIMPLIFICADA
ventasController.getallVenta = async (req, res) => {
    try {
        // Primero intentamos con populate básico
        const ventas = await ventasModel.find()
            .populate("idShoppingCart")
            .sort({ createdAt: -1 });

        console.log('✅ Ventas obtenidas exitosamente:', ventas.length);

        // Formatear datos para el frontend
        const ventasFormateadas = ventas.map(venta => {
            const ventaObj = venta.toObject();
            
            return {
                ...ventaObj,
                // Agregar campos calculados para compatibilidad
                clienteNombre: 'Cliente Anónimo', // Por defecto
                clienteEmail: 'sin-email@ejemplo.com', // Por defecto
                totalProductos: ventaObj.idShoppingCart?.productos?.length || 0,
                fechaFormateada: new Date(ventaObj.createdAt || Date.now()).toLocaleDateString(),
                // Asegurar que existan los campos de estado
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

// Obtener una venta por ID - VERSIÓN SIMPLIFICADA
ventasController.getVentaByiD = async (req, res) => {
    try {
        const { id } = req.params;

        // Validar ID
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

        // Formatear datos
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

// Crear una nueva venta - MANTENER ORIGINAL
ventasController.createVenta = async (req, res) => {
    const {
        idShoppingCart,
        direction,
        metodoPago,
        statusPago,
        statusTransaccion,
    } = req.body;

    try {
        // Validaciones
        if (!idShoppingCart || !direction || !metodoPago) {
            return res.status(400).json({
                success: false,
                message: "Falta información necesaria: (ID del carrito, dirección y método de pago)",
            });
        }

        // Validar que el carrito exista
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

        // Poblar la venta creada para la respuesta
        const ventaCompleta = await ventasModel.findById(ventaGuardada._id)
            .populate("idShoppingCart");

        console.log(`✅ Nueva venta creada: ${ventaGuardada._id}`);

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

// Actualizar una venta por ID - MEJORADO
ventasController.updateVenta = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Validar ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "ID de venta inválido"
            });
        }

        // Verificar que la venta existe
        const ventaExistente = await ventasModel.findById(id);
        if (!ventaExistente) {
            return res.status(404).json({
                success: false,
                message: "Venta no encontrada"
            });
        }

        // Preparar datos de actualización
        const camposPermitidos = [
            'direction', 
            'metodoPago', 
            'statusPago', 
            'statusTransaccion'
        ];
        
        const datosActualizacion = {};
        camposPermitidos.forEach(campo => {
            if (updateData[campo] !== undefined) {
                datosActualizacion[campo] = updateData[campo];
            }
        });

        // Validaciones específicas
        if (datosActualizacion.statusTransaccion) {
            const estadosValidos = ['pendiente', 'en_proceso', 'completado', 'cancelado'];
            if (!estadosValidos.includes(datosActualizacion.statusTransaccion)) {
                return res.status(400).json({
                    success: false,
                    message: "Estado de transacción inválido. Valores válidos: " + estadosValidos.join(', ')
                });
            }
        }

        if (datosActualizacion.statusPago) {
            const estadosPago = ['pendiente', 'pagado', 'rechazado'];
            if (!estadosPago.includes(datosActualizacion.statusPago)) {
                return res.status(400).json({
                    success: false,
                    message: "Estado de pago inválido. Valores válidos: " + estadosPago.join(', ')
                });
            }
        }

        const updatedVenta = await ventasModel.findByIdAndUpdate(
            id,
            datosActualizacion,
            { new: true, runValidators: true }
        ).populate("idShoppingCart");

        console.log(`🔄 Venta actualizada: ${id} - Estado: ${datosActualizacion.statusTransaccion || 'sin cambio'}`);

        res.status(200).json({
            success: true,
            message: "Venta actualizada con éxito",
            data: updatedVenta,
        });

    } catch (error) {
        console.error('Error actualizando venta:', error);
        res.status(400).json({
            success: false,
            message: "Error actualizando la venta",
            error: error.message,
        });
    }
};

// Eliminar una venta por ID - MANTENER ORIGINAL
ventasController.deleteVenta = async (req, res) => {
    try {
        const { id } = req.params;

        // Validar ID
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

        console.log(`🗑️ Venta eliminada: ${id}`);

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

// Obtener estadísticas de ventas - NUEVA FUNCIÓN
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

// Obtener ventas por estado - NUEVA FUNCIÓN
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