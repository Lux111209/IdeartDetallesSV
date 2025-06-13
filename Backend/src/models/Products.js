import { Schema, model } from "mongoose";

const productsSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      match: [/^[^\s].+[^\s]$/, "The name can't be just blank spaces"],
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name must be at most 100 characters"],
    },

    images: {
      type: [String],
      validate: {
        validator: (arr) => arr.every(url => /^https?:\/\/.+/.test(url)),
        message: "All images must be valid URLs",
      },
      required: false,
    },

    productType: {
      type: String,
      required: [true, "Product type is required"],
      enum: ["clothing", "accessory", "home", "other"], 
    },

    subType: {
      type: String,
      required: [true, "Sub type is required"],
      minlength: [2, "Sub type must be at least 2 characters"],
    },

    usageCategory: {
      type: String,
      required: [true, "Usage category is required"],
      enum: ["casual", "formal", "sports", "custom"], 
    },

    color: {
      type: String,
      required: [true, "Color is required"],
    },

    size: {
      type: String,
      required: [true, "Size is required"],
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [10, "Description must be at least 10 characters"],
      maxlength: [500, "Description must be at most 500 characters"],
    },

    stock: {
      type: Number,
      required: [true, "Stock is required"],
      min: [0, "Stock can't be negative"],
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

    tags: {
      type: [String],
      required: false,
      validate: {
        validator: (arr) =>
          Array.isArray(arr) &&
          arr.every(tag => typeof tag === "string" && tag.trim().length > 0),
        message: "Tags must be non-empty strings",
      },
    },

    entryDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

export default model("Product", productsSchema);
