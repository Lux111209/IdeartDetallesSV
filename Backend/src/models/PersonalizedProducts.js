import { text } from "express";
import { Schema, model }  from "mongoose";

const personalizedProductsSchema = new Schema(

    {
       productType: {
      type: String,
      required: [true, "Product type is required"],
    
    },

    subType: {
      type: String,
      required: [true, "Sub type is required"],
      minlength: [2, "Sub type must be at least 2 characters"],
    },

    imgPersonalized: {
      type: [String],
      validate: {
        validator: (arr) => arr.every(url => /^https?:\/\/.+/.test(url)),
        message: "All images must be valid URLs",
      },
      required: false,
    },
    textPersonalized:{
        type: String,
        required: [true, "Text is required"],
        minlength: [2, "Text must be at least 2 characters"],
        maxlength: [500, "Text must be at most 500 characters"],
    }
    , ubicationPersonalized:{
        type: String,
        required: [true, "Ubication is required"],
         enum: ["frontal", "posterior", "ambas", "izquierda", "derecha"],
    },

    usageCategory: {
      type: String,
      required: [true, "Usage category is required"],
    
    },

    color: {
      type: String,
      required: [true, "Color is required"],
    },
    size: {
      type: String,
      required: [true, "Size is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price must be greater than or equal to 0"],
    },

    material: {
      type: String,
      required: false,
      maxlength: [100, "Material must be at most 100 characters"],
    },

    },
    {
        timestamps:true
        
    }
);

export default model("PersonalizedProducts", personalizedProductsSchema);

