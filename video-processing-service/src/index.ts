//Entry point for out project 
import express from "express";
import Ffmpeg from "fluent-ffmpeg";
import {setupDirectories} from "./storage";

setupDirectories();

const app = express();
app.use(express.json());

//HTTP get 
app.post("/process-video",(req,res) =>{
    const inputFilePath = req.body.inputFilePath;
    const outputFilePath = req.body.outputFilePath;

    if (!inputFilePath){
        res.status(400).send("Missing input file path");
    }
    
    if (!outputFilePath){
        res.status(400).send("Missing output file path");
    }
});

const port = process.env.PORT || 3000;
app.listen(port,() =>{
    console.log(`Video processing service running on port ${port}`);
});