import express from "express";
import cors from "cors";
import productRoutes from "./routes/products.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";


dotenv.config();

const app = express();

const allowedOrigins = [
    "*"
];

app.use (
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());



app.use("/api/products",productRoutes);


export default app;

