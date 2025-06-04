const productsController = {};
import productsController from "../models/Products.js";
import {v2 as cloudinary} from "cloudinary";
import { config } from "../config.js";
import productsMOdel from "../models/Products.js"


cloudinary.config({
     cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
     api_key:process.env.CLOUDINARY_API_KEY,
     api_secret:process.env.CLOUDINARY_API_SECRET,
     secure:true

});


console.log('Cloudinary configurado conrrectamente');


productsController.getProducts = async (req,res) => {
     
}

//select all

productsController.getProducts = async (req,res) => {
     const products = await productsMOdel.find();
     res.json(products);   
};

//selec por ID

productsController.getProducts = async (req,res) => {
     const product = await productsMOdel
     .findById(req.params.id);

     if (!product) {
          return res.status(404).json({message:"Productos no encontrados"});
     }
     res.json(product);
}


//create products 

productsController.createProducts = async (req,res) => {
     
     try {
          const{
          name,
          productType,
          subType,
          usageCategory,
          color,
          size,
          description,
          stock,
          price,
          material,
          tags
          }=req.body;


       if (
            !name ||
            !productType ||
            !subType ||
            !usageCategory ||
            !color ||
            !size ||
            !description ||
            stock === undefined ||
            price === undefined ||
            !material ||
            !Array.isArray(tags)
        ) { return res.status(400).json({
    




        })




        }


          
     } catch (error) {
          
     }
}



