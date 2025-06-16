import express from "express";
import cors from "cors";
import productRoutes from "./routes/products.js";
import dotenv from "dotenv";
import cookiparser from "cookie-parser";


dotenv.config();

const app = exxpress();

const allowedOrigins = [
    "*"
]
