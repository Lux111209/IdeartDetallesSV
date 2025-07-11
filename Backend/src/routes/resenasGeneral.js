import express from 'express';
import resenaGeneralController from '../controllers/resenaGeneralController.js';

const router = express.Router();

// CRUD principal
router.route("/")
  .get(resenaGeneralController.getResenas)
  .post(resenaGeneralController.createResena);


// CRUD por id
router.route("/:id")
  .get(resenaGeneralController.getResenaById)
  .put(resenaGeneralController.updateResena)
  .delete(resenaGeneralController.deleteResena);

export default router;