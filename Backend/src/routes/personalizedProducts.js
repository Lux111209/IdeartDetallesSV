import express from "express";
const router = express.Router();
import personalizedProductsController  from "../controllers/PersonalizedProducts.js";
import multer from "multer";


const upload = multer({dest: "public/"});

//Eso era para asegurar que sse suba la carpeta

router.route("/")
.get(personalizedProductsController.getAllPersonalizedProducts)
.post(upload.array("imgPersonalized"), personalizedProductsController.insertPersonalizedProduct);    

router.route("/:id")
.get(personalizedProductsController.getPersonalzizedProdcutById)
.put(upload.array("imgPersonalized"), personalizedProductsController.updatePersonalizedProduct)
.delete(personalizedProductsController.deletePersonalizedProduct);


export default router;