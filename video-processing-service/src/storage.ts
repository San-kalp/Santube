import { Storage } from "@google-cloud/storage";
import fs from 'fs';
import Ffmpeg from "fluent-ffmpeg";
import { resolve } from "path";
import { rejects } from "assert";
import { dir } from "console";

//Instance of GCS 
const storage = new Storage();


const rawVideoBucketName = "sankalp-yt-videos"; //The bucket where people will upload videos to 
const processedVideoBucketName = "sankalp-yt-processed-videos"; // After processing is done, we will upload it in a seperate this bucket.
const localRawVideoPath = "./raw-videos"; //When we download raw videos, we are going to put them in this folder
const localProcessedVideoPath = "./processed-videos"; // When we process videos , we are going to place them in this folder



//Creates locol directories for raw and processes images 
export function setupDirectories(){
    ensureDirectoryExistence(localRawVideoPath);
    ensureDirectoryExistence(localProcessedVideoPath);
}

//Will convert a raw video into processed video 
export function convertVideo(rawVideoName:string,processedVideoName:string){
    return new Promise<void>((resolve,reject)=>{
        Ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
        .outputOptions("-vf","scale= -1:360")//Converting to 360P
        .on("end",()=>{
            console.log("Video processing finished successfully");
            resolve();
        })
        .on("error",(err) =>{
            console.log(`An error occured: ${err.message}`);
            reject(err);
        })
        .save(`${localProcessedVideoPath}/${processedVideoName}`);

    });
}

//Download fileName from rawvideoBucketName to localRawVideoPath
export async function downloadRawVideo(fileName : string){
    await storage.bucket(rawVideoBucketName)
    .file(fileName)
    .download({destination: `${localProcessedVideoPath}/${fileName}`});
    console.log(`gs://${rawVideoBucketName}/${fileName} downloaded to ${localProcessedVideoPath}/${fileName}.`);
}



/**
 * 
 * @param fileName - The name of the file to be uploaded from 
 * {@link localProcessedVideoPath} folder into the {@link processedVideoBucketName}.
 * @returns A promise that resolves when the file has been uploaded.
 */
export async function uploadProcessVideo(fileName:string) {
    const bucket = storage.bucket(processedVideoBucketName);

    await bucket.upload(`${localProcessedVideoPath}/${fileName}`,
    {
        destination:fileName //The name of the file once it is uploaded. We are keeping the same name 
    });
    console.log(`${localProcessedVideoPath}/${fileName} has been uploaded to gs://${processedVideoBucketName}/${fileName}`);


    await bucket.file(fileName).makePublic(); //It should be viewd by anyone who accesses our Yt 

}

/**
 * 
 * @param fileName - The name of the file to be deleted from 
 * {@link localRawVideoPath} folder.
 * @returns A promise that resolves when the file has been deleted
 * 
 */
export function deleteRawVideo(fileName : string){
    return deleteFile(`${localRawVideoPath}/${fileName}`);
}

/**
 * 
 * @param fileName - The name of the file to be deleted from 
 * {@link localProcessedVideoPath} folder.
 * @returns  A promise that resolves when the file has been deleted  
 */
export function deleteProcessedVideo(fileName : string){
    return deleteFile(`${localProcessedVideoPath}/${fileName}`);
}


/**
 * 
 * @param filePath - The path of the file to be deleted 
 * @returns A promise that resolves once the file deleted 
 */
function deleteFile(filePath : string) : Promise<void> {
    return new Promise((resolve,reject) =>{
        if (!fs.existsSync(filePath)){
            fs.unlink(filePath,(err) =>{
                if (err){
                    console.log(`Failed to delete file at ${filePath},err`);
                    reject(err);
                }
                else {
                    console.log(`File deleted at ${filePath}`);
                    resolve();
                }
            })
        }
        else {
            console.log(`File ${filePath} does not exist, skipping the delete`);
            resolve();
        }
    });
}

/**
 * This function ensures that the given dir exists. If not then create it.
 * @param dirPath - The directory path to be checked 
 */
function ensureDirectoryExistence(dirPath: string){
    if (!fs.existsSync(dirPath)){
        fs.mkdirSync(dirPath, {recursive:true});
        console.log(`Directory created at ${dirPath}`);
    }
}



