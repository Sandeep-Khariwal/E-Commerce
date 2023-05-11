import express from "express";
import dotenv from "dotenv"
import path from 'path';
import url from 'url';
import cors from "cors"
// import {} from "../ "

import { DataBase } from "./Database/db.js";
import router from "./Routes/Routes.js";
import categoryRoute from "./Routes/categoryRoute.js";
import productRoute from "./Routes/productRoutes.js";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()
app.use(cors())
app.use(express.json())
// app.use(express.static(path.join(__dirname,"../client/build")))

//initialize dotenv
dotenv.config({path: __dirname + "/ConfigureEnv/.env"})

// Connect Data Base
DataBase()

// Initialize Routers
app.use("/api/v1/auth",router)
app.use("/api/v1/category",categoryRoute)
app.use("/api/v1/product",productRoute)

//rest API
app.use("*",function(req,resp){
   resp.sendFile(path.join(__dirname,"../client/build/index.html"))
})

// URL of server
const URL = process.env.PORT || 8080

app.listen(URL,()=>{
    console.log(`server running on ${process.env.DEV_MODE} on ${URL}`);  
})