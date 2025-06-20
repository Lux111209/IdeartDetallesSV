// Array de métodos (CRUD)
const provedoresController = {};
import Provedores from "../models/Provedores.js";

// SELECT - Obtener todos los proveedores
provedoresController.getProvedores = async (req, res) => {
  const provedores = await Provedores.find();
  res.json(provedores);
};

// INSERT - Crear un nuevo proveedor
provedoresController.createProvedor = async (req, res) => {
  const { nombre, productobrindado, numero, correo, imgProvedor } = req.body;
  const newProvedor = new Provedores({ nombre, productobrindado, numero, correo, imgProvedor });
  await newProvedor.save();
  res.json({ message: "Proveedor guardado" });
};

// DELETE - Eliminar un proveedor por ID
provedoresController.deleteProvedor = async (req, res) => {
  const deletedProvedor = await Provedores.findByIdAndDelete(req.params.id);
  if (!deletedProvedor) {
    return res.status(404).json({ message: "Proveedor no encontrado" });
  }
  res.json({ message: "Proveedor eliminado" });
};

// UPDATE - Actualizar un proveedor por ID
provedoresController.updateProvedor = async (req, res) => {
  const { nombre, productobrindado, numero, correo, imgProvedor } = req.body;
  await Provedores.findByIdAndUpdate(
    req.params.id,
    { nombre, productobrindado, numero, correo, imgProvedor },
    { new: true }
  );
  res.json({ message: "Proveedor actualizado" });
};

export default provedoresController;