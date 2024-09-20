const express=require('express');
const router=express.Router();
const FitnessVideo=require('../models/videoModel')
const imagekit=require('../utils/imageKitCredentials')
const mongoose=require('mongoose');
const User=require('../models/User');
const { required } = require('joi');
const multer=require('multer');
const upload=multer({ dest:'files/'})
const  fs = require('fs');
const { isVideoAuthor, isLoggedIn } = require('../middleware');
const Program = require('../models/Program');

router.get('/allvideos' , async(req,res)=>{
    try{
        let fitnessVideos=await FitnessVideo.find({}).populate('coach');
        // let coach=fitnessVideos
        // let coach=await User.find({});

        // fitnessVideos=await fitnessVideos.populate('coach');
        res.status(201).json({msg: "Gotcha",data:fitnessVideos});
    }catch(e){
        res.status(400).json({msg: "Something went wrong..." });

    }
})

router.get('/show/:data', async(req,res)=>{
    try {
        let data=req.params.data;
        let fitnessVideos=await FitnessVideo.findById(data).populate('coach');
        res.status(201).json({msg: "Gotcha" , data:fitnessVideos});
    } catch (e) {
        res.status(400).json({msg: "Something went wrong..." });

    }
})

router.delete('/delete/:id',isLoggedIn, isVideoAuthor ,async (req,res)=>{
    try {
        let id=req.params.id;
        let programs=await Program.find({});
        for(let program of programs){
            for(let day=0;day<program.schedule.length;day++){
                for(let vid of program.schedule[day]){
                    if(id==vid){
                        await Program.findByIdAndDelete(program._id);
                    }
                }
            }
        }
        let fitnessVideos=await FitnessVideo.findById(id)
        imagekit.deleteFile(fitnessVideos.fileId, function(error, result) {
            if(error) console.log(error);
            else console.log(result);
        });
        imagekit.deleteFile(fitnessVideos.imgFileId, function(error, result) {
            if(error) console.log(error);
            else console.log(result);
        });
        let response=await FitnessVideo.findByIdAndDelete(id);
        res.status(201).json({msg: "Gotcha" });
    } catch (e) {
        res.status(400).json({msg: "Something went wrong..." });
    }
})

// const check=async (req,res,next)=>{
//     let {name,tags,id}=req.body;
//     let arr=tags.split(",");
//     if(!req.files){
//         let found=await Product.findById(id);
//         next();
//     // }else{
//     //     if(req.files.file && req.files.imgFile){
//     //         res.redirect('/add');

//     //     }if(req.files.file){
//     //         upload.fields([
//     //             { name: 'file', maxCount: 1 },
//     //            ])
//     //            fs.readFile(req.files.file[0].path, function(err, data) {
//     //             if (err) throw err; // Fail if the file can't be read.
//     //             imagekit.upload({
//     //               file : data, //required
//     //               fileName : name, //required
//     //                 folder:'/fitness'
//     //             }, async function(error, result) {
//     //               if(error) console.log(error);
//     //               else{
//     //                 try {
//     //                     let found=await Product.findById(id);
//     //                     await FitnessVideo.create({ name ,fileId,tags:arr, filePath,fileUrl,coach,imgFileId,imgFileUrl,imgFilePath});
//     //                     res.status(201).json({msg: "New video added"});
//     //                   } catch (e) {
//     //                     res.status(400).json({msg: "Something went wrong..."});
//     //                   }
//     //               }
//     //             });
//     //           });
//     //     }else if(req.files.imgFile){
//     //         upload.fields([
//     //             { name: 'imgFile', maxCount: 1 }
//     //            ])
//     //     }
//     }
// }

router.patch('/edit/:id',isLoggedIn,isVideoAuthor  , upload.none(), async(req,res)=>{
    try{
        let {name,tags,id}=req.body;
        let arr=tags.split(",");
        let found=await FitnessVideo.findById(id);
        let {fileId, imgFileId, filePath , imgFilePath, fileUrl, imgFileUrl}=found;
        await FitnessVideo.findByIdAndUpdate(id,{name, tags:arr, fileId, imgFileId, filePath , imgFilePath, fileUrl, imgFileUrl});
        res.status(201).json({msg: "Gotcha"} );
    }catch(e){
        res.status(400).json({msg: "Something went wrong..." });
    }
})
router.patch('/edit/imgf/:id',isLoggedIn,isVideoAuthor  ,upload.fields([
    { name: 'imgFile', maxCount: 1 }
   ]), async(req,res)=>{
  
        fs.readFile(req.files.imgFile[0].path, function(err, data) {
            if (err) throw err; // Fail if the file can't be read.
            else{
                var {name,tags,id}=req.body;
                imagekit.upload({
                file : data, //required
                fileName : name+"img", //required
                folder: '/fitnessImages'
                }, async function(error, result) {
                if(error) console.log(error);
                else{
                        var {name,tags,id}=req.body;
                        let arr=tags.split(",");
                        let found=await FitnessVideo.findById(id);
                        let {fileId, fileUrl, filePath, imgFileId}=found;
                        imagekit.deleteFile(imgFileId, function(error, result) {
                            if(error) console.log(error);
                            else console.log(result);
                        });
                        imgFileId=result.fileId;
                        let imgFilePath=result.filePath;
                        let imgFileUrl=result.url;
                        try {
                            await FitnessVideo.findByIdAndUpdate(id,{name, tags:arr, fileId, imgFileId, filePath , imgFilePath, fileUrl, imgFileUrl});                        res.status(201).json({msg: "New video added"});
                            res.status(201).json({msg: "Gotcha"} );
                        } catch (e) {
                            res.status(400).json({msg: "Something went wrong..."});
                        }
                }
                });
            }
          });
        
   
})




// router.patch('/edit/:id',isLoggedIn,isVideoAuthor  , upload.none(), async(req,res)=>{
//     try{
//         let {name,tags,id}=req.body;
//         console.log("This  is name tag id", name,tags,id);
//         let arr=tags.split(",");
//         console.log("This  is name tag id", name,tags,id,arr);
//         let found=await FitnessVideo.findById(id);
//         console.log("this is found",found);
//         let {fileId, imgFileId, filePath , imgFilePath, fileUrl, imgFileUrl}=found;
//         await FitnessVideo.findByIdAndUpdate(id,{name, tags:arr, fileId, imgFileId, filePath , imgFilePath, fileUrl, imgFileUrl});
//         res.status(201).json({msg: "Gotcha"} );
//     }catch(e){
//         res.status(400).json({msg: "Something went wrong..." });
//     }
// })
router.patch('/edit/f',isLoggedIn , isVideoAuthor ,upload.fields([
    { name: 'file', maxCount: 1 },
   ]), async(req,res)=>{
  
        fs.readFile(req.files.file[0].path, function(err, data) {
            if (err) throw err; // Fail if the file can't be read.
            else{
                var {name,tags,id}=req.body;
                imagekit.upload({
                file : data, //required
                fileName : name, //required
                folder: '/fitness'
                }, async function(error, result) {
                if(error) console.log(error);
                else{
                        var {name,tags,id}=req.body;
                        let arr=tags.split(",");
                        let found=await FitnessVideo.findById(id);
                        let {fileId, imgFilePath , imgFileUrl, imgFileId}=found;
                        imagekit.deleteFile(fileId, function(error, result) {
                            if(error) console.log(error);
                            else console.log(result);
                        });
                        fileId=result.fileId;
                        let filePath=result.filePath;
                        let fileUrl=result.url;
                        try {
                            
                            
                            await FitnessVideo.findByIdAndUpdate(id,{name, tags:arr, fileId, imgFileId, filePath , imgFilePath, fileUrl, imgFileUrl});                        res.status(201).json({msg: "New video added"});
                            res.status(201).json({msg: "Gotcha"} );
                        } catch (e) {
                            res.status(400).json({msg: "Something went wrong..."});
                        }
                }
                });
            }
          });
        
   
})

router.get('/getall', isLoggedIn,async(req,res)=>{
    try {
        let found=await FitnessVideo.find({coach:req.user._id});
        res.status(201).json({msg: "Gotcha" ,  data:found} );
    } catch (e) {
        res.status(400).json({msg: "Something went wrong..."});
    }
})



router.post('/changevideolike',isLoggedIn, async(req,res)=>{
    try{
       let vid=req.body;
       let user=req.user;
       let arr=[];
       let flag=false;
       for(let i=0;i<user.likedVideos.length;i++){
            if(vid._id.toString()==(user.likedVideos[i].toString())){
                flag=true;
                break;
            }
       }

       if(flag){
        for(let i=0;i<user.likedVideos.length;i++){
            if(user.likedVideos[i] && vid._id.toString()!=(user.likedVideos[i].toString())){
                arr.push(user.likedVideos[i]);
            }
        }
       }else{
        arr=[...user.likedVideos];
        arr.push(vid._id);
       }
       let result=await User.updateOne({_id: user._id}, {likedVideos: arr});
       res.status(201).json({msg: "Gotcha" } );
     }catch(e){
         res.status(400).json({msg: "Something went wrong..." });
     }
})





module.exports=router;