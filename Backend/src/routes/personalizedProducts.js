import express from "express";
cont router = express.Router();
import personalizedProductsController  from "../controllers/PersonalizedProducts";
import multer from "multer";
import router from "./carrito";

const upload = multer({dest: "public/"});

//Eso era para asegurar que sse suba la carpeta

router.route("/")
.get(personalizedProductsController.getAllPersonalizedProducts)
.post(upload.array("images"), personalizedProductsController.insertPersonalizedProduct);    

router.route("/:id")
.get(personalizedProductsController.getPersonalzizedProdcutById)
.put(upload.array("images"), personalizedProductsController.updatePersonalizedProduct)
.delete(personalizedProductsController.deletePersonalizedProduct);


export default router;