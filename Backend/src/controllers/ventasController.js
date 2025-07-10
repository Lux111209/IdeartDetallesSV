import ventasModel from "../models/Ventas.js";
import mongoose from "mongoose";
import carritoModel from "../models/CarritoCompra.js";

const ventasController = {};

// Obtener todas las ventas
ventasController.getallVenta = async (req, res) => {
    try {
        const ventas = await ventasModel.find().populate("idShoppingCart");
        res.status(200).json(ventas);
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener las ventas",
            error: error.message,
        });
    }
};

// Obtener una venta por ID
ventasController.getVentaByiD = async (req, res) => {
    try {
        const venta = await ventasModel.findById(req.params.id).populate("idShoppingCart");
        if (!venta) {
            return res.status(404).json({ message: "Venta no encontrada" });
        }
        res.status(200).json(venta);
    } catch (error) {
        res.status(500).json({
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
                message: "Falta información necesaria: (ID del carrito, dirección y método de pago)",
            });
        }

        const carrito = await carritoModel.findById(idShoppingCart);
        if (!carrito) {
            return res.status(404).json({ message: "El carrito no fue encontrado" });
        }

        const newVenta = new ventasModel({
            idShoppingCart,
            direction,
            metodoPago,
            statusPago,
            statusTransaccion,
        });

        await newVenta.save();

        res.status(201).json({
            message: "Venta creada con éxito",
            venta: newVenta,
        });
    } catch (error) {
        res.status(400).json({
            message: "Error al crear la venta",
            error: error.message,
        });
    }
};

// Actualizar una venta por ID
ventasController.updateVenta = async (req, res) => {
    const {
        idShoppingCart,
        direction,
        metodoPago,
        statusPago,
        statusTransaccion,
    } = req.body;

    try {
        const update = {
            idShoppingCart,
            direction,
            metodoPago,
            statusPago,
            statusTransaccion,
        };

        const updatedVenta = await ventasModel.findByIdAndUpdate(
            req.params.id,
            update,
            { new: true }
        ).populate("idShoppingCart");

        if (!updatedVenta) {
            return res.status(404).json({ message: "Venta no encontrada" });
        }

        res.status(200).json({
            message: "Venta actualizada con éxito",
            venta: updatedVenta,
        });
    } catch (error) {
        res.status(400).json({
            message: "Error actualizando la venta",
            error: error.message,
        });
    }
};

// Eliminar una venta por ID
ventasController.deleteVenta = async (req, res) => {
    try {
        const deletedVenta = await ventasModel.findByIdAndDelete(req.params.id);
        if (!deletedVenta) {
            return res.status(404).json({ message: "Venta no encontrada" });
        }
        res.status(200).json({ message: "Venta eliminada con éxito" });
    } catch (error) {
        res.status(400).json({
            message: "Error al eliminar la venta",
            error: error.message,
        });
    }
};

export default ventasController;