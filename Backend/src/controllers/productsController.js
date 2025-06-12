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

   ///Validacion de campos 
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
               message: "Todos los campos son obligatorios",
               required:["name", "productType", "subType", "usageCategory", "color", "size", "description", "stock", "price", "material", "tags"],
               received:{name,productType,subType,usageCategory,color,size,description,stock,price,material,tags}
        });
        }


        let imageUrl = "";
        

        //subimos la imagen a cludinary 

        if (req.file) {
          try {
               //Verificamos que el archivo si exista :
               if (!req.file.path) {
                    
                    console.error("Error: El archivo no tinee ruta valida",req.file);

                    //continaumaos creando el prodcuto sin imagen 
                    console.warn("Continuando sin imagen por porblema de archivo");

               } else{
                    console.log("Detalles del archivo:",{
                         path: req.file.path,
                         mimetype: req.file.mimetype,
                         size: req.file.size,
                         filename: req.file.filename
                    });


                    //intentamos subirlo a cloudinary 
                    try {
                         console.log("lA IMG  SE ESTA SUBIENDO A CLOUDINARY",req.file.path);
                         const result =await cloudinary.uploader.upload(req.file.path,
                              {
                                   folder: "Ideart",
                                   resource_type: "auto",
                                   allowed_formats: ["jpg","png","jpeg","webp"],
                                   transformation:[{width:800,height:600, crop : "limit"}],
                                   quality: "auto:good",
                                   fetch_format: "auto"
                    });

                    //Verifcar que  el resultado tenga los resultados

                    if (result && result.secure_url) {
                         imageUrl= result.secure_url;
                         imagePublicId = result.public_id;

                         console.log("Imagen subida correctamente a Cloudinary:",{
                              url:imageUrl,
                              format:result.format,
                              resource_type: result.resource_type
                         });
                    }else{

                         console.error("Error:Cloudinary no  devolvio una Url segura",result);
                         //Continaumos  con la creaacion sin imagen 
                    }
                         
                    } catch (cloudinaryError) {
                         console.error("Error al subir imagen a Cloudinary",cloudinaryError);
                         console.warn("Continaundo sin imagen debido a un error de Cloudinary");
                    }
               }
               
          } catch (fileError) {
               console.error("Error general al intentar procesar el archivo:",fileError);
               
               console.warn("Continaundo sin imagen debido a un error general");
          }
          
        }else{
          console.log("No recibio ningun archivo de imagen");
        }

        //Creamos el  objeto del producto
        const newProduct = new productsMOdel({
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
          tags,
          image: imageUrl ? { url: imageUrl, publicId: imagePublicId } : null // Si no hay imagen, se establece como null
        });

        //GuaRDAMOS EN LA BASE DE DATOS

        const savedProduct = await newProduct.save();
        console.log("Producto guardado correctamente:", savedProduct._id);

        //respondamos con exito 
        return res.status(201).json({
          message:"Prodcuto creado con exito",
          product: savedProduct
        });
  
     } catch (error) {
         
          console.error("Error al crear producto:",error);
          //mANEJAMOS ERRORES DE VALIDACION DE MOOGOSE

          if (error.name === 'ValidationError') {
               const validationErrors = {};

               //Extraer los mensajes de error de validacion 

               for(const field in error.erros){
                    validationErrors[field]= error.erros[field].message;
               }

               return res.status(400).json({
                    message: "Error de validacion",
                    errors:validationErrors
               });
          }

          return res.status(500).json({
               message:"Error al crear el producto",
               error:error.message
          });
     }
};



