// controllers/dashboardController.js
import Product from "../models/Products.js";
import Ventas from "../models/Ventas.js";
import ResenaProducto from "../models/ResenaProducto.js";
import ResenaGeneral from "../models/ResenaGeneral.js";


// -------------------- Funciones individuales -------------------- //

// Productos por categoría (para gráfico de pastel)
export const getProductosPorCategoria = async (req, res) => {
  try {
    const productos = await Product.aggregate([
      { $group: { _id: "$productType", count: { $sum: 1 } } },
      { $project: { categoria: "$_id", count: 1, _id: 0 } }
    ]);
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Stock bajo (para alertas o gráfico de barras)
export const getStockBajo = async (req, res) => {
  try {
    const stockBajo = await Product.find({ stock: { $lt: 10 } }).select("name stock");
    res.json(stockBajo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Promedio de reseñas por producto
export const getPromedioResenasProductos = async (req, res) => {
  try {
    const resenas = await ResenaProducto.aggregate([
      { $group: { _id: "$id_producto", promedio: { $avg: "$ranking" } } }
    ]);
    res.json(resenas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Promedio de reseñas generales
export const getPromedioResenasGenerales = async (req, res) => {
  try {
    const resenas = await ResenaGeneral.aggregate([
      { $group: { _id: "$id_producto", promedio: { $avg: "$ranking" } } }
    ]);
    res.json(resenas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ventas por mes
export const getVentasPorMes = async (req, res) => {
  try {
    const ventas = await Ventas.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalVentas: { $sum: 1 },
          totalDinero: { $sum: "$total" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -------------------- Función completa para Dashboard -------------------- //

export const getDashboardData = async (req, res) => {
  try {
    const totalProductos = await Product.countDocuments();
    const stock = await Product.aggregate([{ $group: { _id: null, total: { $sum: "$stock" } } }]);
    const productosSinStock = await Product.countDocuments({ stock: 0 });
    const totalUsuarios = await (await import("../models/User.js")).default.countDocuments();

    const ventasMes = await Ventas.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalVentas: { $sum: 1 },
          totalDinero: { $sum: "$total" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const promedioResenasProducto = await ResenaProducto.aggregate([
      { $group: { _id: "$id_producto", promedio: { $avg: "$ranking" } } }
    ]);

    const promedioResenasGeneral = await ResenaGeneral.aggregate([
      { $group: { _id: "$id_producto", promedio: { $avg: "$ranking" } } }
    ]);

    res.json({
      totalProductos,
      stock: stock[0]?.total || 0,
      productosSinStock,
      totalUsuarios,
      ventasMes,
      promedioResenasProducto,
      promedioResenasGeneral
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
