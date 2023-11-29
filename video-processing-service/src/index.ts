//Entry point for out project 
import express from "express";
import Ffmpeg from "fluent-ffmpeg";



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

    Ffmpeg(inputFilePath)
        .outputOptions("-vf","scale= -1:360")//Converting to 360P
        .on("end",()=>{
            res.status(200).send("Video processing finished successfully")
        })
        .on("error",(err) =>{
            console.log(`An error occured: ${err.message}`);
            res.status(500).send(`Internal Server Error :${err.message}`);
        })
        .save(outputFilePath);
});

const port = process.env.PORT || 3000;
app.listen(port,() =>{
    console.log(`Video processing service running on port ${port}`);
});