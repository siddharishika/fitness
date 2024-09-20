const express=require('express');
const videoController=require('../controller/videoController')
const router=express.Router();
const FitnessVideo=require('../models/videoModel')
const User=require('../models/User');
const passport = require('passport');
const multer=require('multer');
const imagekit = require('../utils/imageKitCredentials');
const upload=multer({ dest:'files/'})
const fs=require('fs');
const { isLoggedIn } = require('../middleware');


router.get('/getuser',isLoggedIn, async(req,res)=>{
    try{
        let id=req.user._id;
        let user=await User.findOne({_id:id}).populate('currentProgram').populate({path:'workoutHistory'})
        .populate('likedPrograms').populate('likedVideos').populate('likedRecipes');
        
        res.status(201).json({msg: "Gotcha",data:user});
    }catch(e){
        res.status(400).json({msg: "Something went wrong..." });

    }
})

router.get('/getlikedvideos',isLoggedIn, async(req,res)=>{
    // try{
        let user=req.user;
        let data=await User.findOne({_id:user._id}).populate('likedVideos');
        // data=await data.populate('coach');
        res.status(201).json({msg: "Gotcha",data:data});
    // }catch(e){
    //     res.status(400).json({msg: "Something went wrong..." });

    // }
})



module.exports=router;
