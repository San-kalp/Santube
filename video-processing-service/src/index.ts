//Entry point for out project 
import express from "express";
import {setupDirectories,downloadRawVideo,uploadProcessVideo,convertVideo, deleteProcessedVideo, deleteRawVideo} from "./storage";

setupDirectories();

const app = express();
app.use(express.json());

//HTTP post that will be called by pub/sub
app.post("/process-video",async (req,res) =>{
    //Get the bucket and filename from the cloud pub/sub message queue 
    let data;
    try{
        const message =Buffer.from(req.body.message.data,'base64').toString('utf-8');
        data = JSON.parse(message);
        if (!data){
            throw new Error('Invalid message payload received from PUB/SUB.');
        }
    }
    catch(error){
        console.error(error);
        return res.status(400).send('Bad request: Missing filename.');
    }
    const inputFileName = data.name;
    const outputFileName = `processed-${inputFileName}`;

    //Download raw video from cloud storage 
    await downloadRawVideo(inputFileName);

    //Processing - convert the videon to 360p
    try {
        await convertVideo(inputFileName,outputFileName);
    }catch(err){
        //Even if video processing failed , we need to delete it from our local
        await Promise.all([
            deleteRawVideo(inputFileName),
            deleteProcessedVideo(outputFileName)
        ])
        console.log(err);
        return res.status(400).send('Internal server error : video processing failed.');
    }

    //Upload the processes video to cloud storage 
    await uploadProcessVideo(outputFileName);

    //Delete after uploading
    await Promise.all([
        deleteRawVideo(inputFileName),
        deleteProcessedVideo(outputFileName)
    ]);

    return res.status(200).send('Processing fininshed successfully');

}
);

const port = process.env.PORT || 3000;
app.listen(port,() =>{
    console.log(`Video processing service running on port ${port}`);
});