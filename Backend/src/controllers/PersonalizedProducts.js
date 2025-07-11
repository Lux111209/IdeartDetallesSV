import personalizedModel from "../models/PersonalizedProducts.js";
import {v2 as cloudinary} from "cloudinary";
import { config } from "../../config.js";
import productsController from "./productsController";

//Configuramos Cloudinary

console.log("Cloudinary Config Values:");
console.log("cloud_name:", config.CLOUDINARY.CLOUD_NAME);
console.log("api_key:", config.CLOUDINARY.API_KEY);
console.log("api_secret:", config.CLOUDINARY.API_SECRET);

cloudinary.config({
  cloud_name: config.CLOUDINARY.CLOUD_NAME,
  api_key: config.CLOUDINARY.API_KEY,
  api_secret: config.CLOUDINARY.API_SECRET,
  secure: true
});

const personalizedProductsController = {};

//Select Personalized Products

personalizedProductsController.getAllPersonalizedProducts = async (req, res) => {

    try {
        const personalizedProducts = await personalizedModel.find();
        res.json(personalizedProducts);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

//Select Personalized Product by ID

personalizedProductsController.getPersonalzizedProdcutById = async (req, res) => {
    try {
        const personalizedProduct = await personalizedModel.findById(req.params.id);
        if (!personalizedProduct) return res.status(404).json({message: "Personalized product not found"});
        res.json(personalizedProduct);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};


//Insert Peronnalized Product 

personalizedProductsController.insertPersonalizedProduct = async (req, res) => {

    try {
        const{
            productType,
            subType,
            imgPersonalized,
            textPersonalized,
            ubicationPersonalized,
            usageCategory,
            color,
            size,
            price,
            material
        }= req.body;

        let imagesUrl = [];

        //Subir todas las img a cloudinary
        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map(file =>
                cloudinary.uploader.upload(file.path,
                    {
                        folder: "personalizedProducts",
                         allowed_formats: ["jpg", "png", "jpeg", "pdf", "tiff"],
                    })
            );
              const results = await Promise.all(uploadPromises);
              imagesUrl = results.map(results => results.secure_url);           
        }
          
        //Creamoss el nuevo producto

        const newPersonalizedProduct = new personalizedModel({
            productType,
            subType,
            imgPersonalized: imagesUrl,
            textPersonalized,
            ubicationPersonalized,
            usageCategory,
            color,
            size,
            price,
            material
        });

        await newPersonalizedProduct.save();


         res.status(201).json({message: "Personalized product created", personalizedProduct: newPersonalizedProduct});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

//Update Personalized Product 

personalizedProductsController.updatePersonalizedProduct = async (req,res) => {
    const{
        productType,
            subType,
            imgPersonalized,
            textPersonalized,
            ubicationPersonalized,
            usageCategory,
            color,
            size,
            price,
            material
       } = req.body;

       let imagesURL = [];

       ///sUBIR NUEVA IMAGENES A CLOUDINARY 

       //Subir todas las img a cloudinary
        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map(file =>
                cloudinary.uploader.upload(file.path,
                    {
                        folder: "personalizedProducts",
                         allowed_formats: ["jpg", "png", "jpeg", "pdf", "tiff"],
                    })
            );
              const results = await Promise.all(uploadPromises);
              imagesUrl = results.map(results => results.secure_url);           
        }

        //Construimos el objeto actualizado 

        const updateData = 
        {
            productType,
            subType,
            imgPersonalized,
            textPersonalized,
            ubicationPersonalized,
            usageCategory,
            color,
            size,
            price,
            material
        };

        //Solo acutalizamos img si se envio nuevas 
        if (imagesURL.length > 0) {
              updateData.images = imagesURL;
           }

        const updatePersonalizedProduct = await personalizedModel.findByIdAndUpdate(
            req.params.id,
            updateData,
            {new: true}
        );
        res.status(200).json({message: "Personalized product updated ", personalizedProduct: updatePersonalizedProduct});
};

//delete Personalized Products

personalizedProductsController.deletePersonalizedProduct = async (req, res) => {
    try {
        const personalizedProduct = await personalizedModel.findByIdAndDelete(req.params.id);
        if (!personalizedProduct) return res.status(404).json({message: "Personalized product not found"});
        res.json({message: "Personalized product deleted"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

export default personalizedProductsController;
