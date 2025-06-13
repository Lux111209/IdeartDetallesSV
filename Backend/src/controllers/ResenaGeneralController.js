// Array de métodos (CRUD)
const resenaGeneralController = {};
import ResenaGeneral from "../models/ResenaGeneral.js";

// SELECT - Obtener todas las reseñas generales
resenaGeneralController.getResenas = async (req, res) => {
  const resenas = await ResenaGeneral.find();
  res.json(resenas);
};

// INSERT - Crear una nueva reseña general
resenaGeneralController.createResena = async (req, res) => {
  const { ranking, titulo, tipoExperiencia, detalle, id_user, id_producto } = req.body;
  const nuevaResena = new ResenaGeneral({ ranking, titulo, tipoExperiencia, detalle, id_user, id_producto });
  await nuevaResena.save();
  res.json({ message: "Reseña guardada" });
};

// DELETE - Eliminar una reseña general por ID
resenaGeneralController.deleteResena = async (req, res) => {
  const deletedResena = await ResenaGeneral.findByIdAndDelete(req.params.id);
  if (!deletedResena) {
    return res.status(404).json({ message: "Reseña no encontrada" });
  }
  res.json({ message: "Reseña eliminada" });
};

// UPDATE - Actualizar una reseña general por ID
resenaGeneralController.updateResena = async (req, res) => {
  const { ranking, titulo, tipoExperiencia, detalle, id_user, id_producto } = req.body;
  await ResenaGeneral.findByIdAndUpdate(
    req.params.id,
    { ranking, titulo, tipoExperiencia, detalle, id_user, id_producto },
    { new: true }
  );
  res.json({ message: "Reseña actualizada" });
};

export default resenaGeneralController;