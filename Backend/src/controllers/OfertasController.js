// Array de métodos (CRUD)
const ofertasController = {};
import Ofertas from "../models/Ofertas.js";

// SELECT - Obtener todas las ofertas
ofertasController.getOfertas = async (req, res) => {
  const ofertas = await Ofertas.find();
  res.json(ofertas);
};

// INSERT - Crear una nueva oferta
ofertasController.createOferta = async (req, res) => {
  const { nombreOferta, DescuentoRealizado, productos, creada, expirada } = req.body;
  const nuevaOferta = new Ofertas({ nombreOferta, DescuentoRealizado, productos, creada, expirada });
  await nuevaOferta.save();
  res.json({ message: "Oferta guardada" });
};

// DELETE - Eliminar una oferta por ID
ofertasController.deleteOferta = async (req, res) => {
  const deletedOferta = await Ofertas.findByIdAndDelete(req.params.id);
  if (!deletedOferta) {
    return res.status(404).json({ message: "Oferta no encontrada" });
  }
  res.json({ message: "Oferta eliminada" });
};

// UPDATE - Actualizar una oferta por ID
ofertasController.updateOferta = async (req, res) => {
  const { nombreOferta, DescuentoRealizado, productos, creada, expirada } = req.body;
  await Ofertas.findByIdAndUpdate(
    req.params.id,
    { nombreOferta, DescuentoRealizado, productos, creada, expirada },
    { new: true }
  );
  res.json({ message: "Oferta actualizada" });
};

export default ofertasController;