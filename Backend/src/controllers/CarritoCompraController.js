import cartModel from "../models/CarritoCompra.js";
import mongoose from "mongoose";

const CarritoCompraController = {};

// ===== OBTENER TODOS =====
CarritoCompraController.getCarritoCompra = async (req, res) => {
  try {
    const carrito = await cartModel.find()
      .populate("products.idProducts", "name image stock price")
      .populate("idUser", "username email")
      .populate("Ofertas.idOfertas", "nombreOferta DescuentoRealizado");

    res.status(200).json(carrito);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener carritos", error: error.message });
  }
};

// ===== OBTENER POR ID =====
CarritoCompraController.getCarritoCompraById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const carrito = await cartModel.findById(req.params.id)
      .populate("products.idProducts", "name image stock price")
      .populate("idUser", "username email")
      .populate("Ofertas.idOfertas", "nombreOferta DescuentoRealizado");

    if (!carrito) return res.status(404).json({ message: "Carrito no encontrado" });

    res.status(200).json(carrito);
  } catch (error) {
    res.status(500).json({ message: "Error al buscar el carrito", error: error.message });
  }
};

// ===== CREAR =====
CarritoCompraController.createCarritoCompra = async (req, res) => {
  const { products, idUser, Ofertas = [], total = 0 } = req.body;

  try {
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Products debe ser un array con al menos un producto" });
    }
    if (!idUser || !mongoose.Types.ObjectId.isValid(idUser)) {
      return res.status(400).json({ message: "ID de usuario inválido" });
    }

    for (let product of products) {
      if (!product.idProducts || !mongoose.Types.ObjectId.isValid(product.idProducts)) {
        return res.status(400).json({ message: "ID de producto inválido" });
      }
      if (!product.cantidad || product.cantidad <= 0) {
        return res.status(400).json({ message: "Cantidad debe ser mayor a 0" });
      }
    }

    const newCarrito = new cartModel({ products, idUser, Ofertas, total });
    await newCarrito.save();

    res.status(201).json({ message: "Carrito creado exitosamente", carrito: newCarrito });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el carrito", error: error.message });
  }
};

// ===== ACTUALIZAR =====
CarritoCompraController.updateCarrito = async (req, res) => {
  const { products, idUser, Ofertas, total } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID de carrito inválido" });
    }

    const update = {};
    if (products) update.products = products;
    if (idUser) update.idUser = idUser;
    if (Ofertas) update.Ofertas = Ofertas;
    if (total !== undefined) update.total = total;

    const updated = await cartModel.findByIdAndUpdate(req.params.id, update, { new: true })
      .populate("products.idProducts", "name image stock price")
      .populate("idUser", "username email")
      .populate("Ofertas.idOfertas", "nombreOferta DescuentoRealizado");

    if (!updated) return res.status(404).json({ message: "Carrito no encontrado" });

    res.status(200).json({ message: "Carrito actualizado exitosamente", carrito: updated });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar carrito", error: error.message });
  }
};

// ===== ELIMINAR =====
CarritoCompraController.deleteCarrito = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID de carrito inválido" });
    }

    const deleted = await cartModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Carrito no encontrado" });

    res.status(200).json({ message: "Carrito eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el carrito", error: error.message });
  }
};

export default CarritoCompraController;
