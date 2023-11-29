//Entry point for out project 
import express from "express";


const app = express();
const port = 3000;

//HTTP get 
app.get("/",(req,res) =>{
    res.send("Hello world");
});


app.listen(port,() =>{
    console.log(`Video processing service running on port ${port}`);
});