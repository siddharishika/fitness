const express=require('express');
const videoController=require('../controller/videoController')
const router=express.Router();
const FitnessVideo=require('../models/videoModel')
const {validateVideo}=require('../middleware')
const FormData=require('form-data');
const multer=require('multer');
const upload=multer({ dest:'files/'})
// const upload2=multer({ dest:'files2/'})
const  fs = require('fs');
const imagekit=require('../utils/imageKitCredentials');
const { isLoggedIn , isCoach} = require('../middleware');


router.post('/add',isLoggedIn,isCoach ,upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'imgFile', maxCount: 1 }
   ]),   async(req,res)=>{
    
        var {name , tags}=req.body;

        if (!name?.trim()) {
            return res.status(400).json({ msg: "Video title is required." });
        }
        if (!req.files?.file?.[0]) {
            return res.status(400).json({ msg: "Workout video file is required." });
        }
        if (!req.files?.imgFile?.[0]) {
            return res.status(400).json({ msg: "Thumbnail photo is required." });
        }

        let arr=tags.split(",");
        
        
        fs.readFile(req.files.file[0].path, async function(err, data) {
            if (err) throw err; // Fail if the file can't be read.
            imagekit.upload({
              file : data, //required
              fileName : `${String(name).trim().replace(/\s+/g, "_")}.mp4`, //required
              folder: '/fitness'
            }, async function(error, result) {
              if(error) console.log(error);
              else {

                fs.readFile(req.files.imgFile[0].path, async function(err, data2) {
                    if (err) throw err; 
                imagekit.upload({
                    file : data2, //required
                    fileName : name+"img", //required
                    folder: '/fitnessImages'
                  }, async function(error, result2) {
                    if(error) console.log(error);
                    else {
                      let fileId=result.fileId;
                      let filePath=result.filePath;
                      let fileUrl=result.url;
                      let imgFileId=result2.fileId;
                      let imgFilePath=result2.filePath;
                      let imgFileUrl=result2.url;
                      let coach=req.user._id;
                      try {
                        await FitnessVideo.create({ name ,fileId,tags:arr, filePath,fileUrl,coach,imgFileId,imgFileUrl,imgFilePath});
                        res.status(201).json({msg: "New video added"});
                      } catch (e) {
                        res.status(400).json({msg: "Something went wrong..."});
                      }
                    }
                  });
                });
            }
            });
            
       
          });
   
    
})

module.exports=router;