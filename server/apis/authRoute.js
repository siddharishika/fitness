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


router.post('/signup',upload.fields([
    { name: 'profilePicture', maxCount: 1 },
   ])  ,async(req,res)=>{
    try{
        let file=req.files.profilePicture[0];
        fs.readFile(file.path, function(err, data) {
            if (err) throw err; // Fail if the file can't be read.
            imagekit.upload({
              file : data, //required
              fileName : "User"+req.body.username, //required
              folder: '/user'
            }, async function(error, result) {
              if(error) {
                console.log(error);
                res.status(400).json({msg: "Something went wrong..."});
              }
              else{
                let fileId=result.fileId;
                let filePath=result.filePath;
                let fileUrl=result.url;
                // let likedPrograms=[];
                // let likedVideos=[];
                // let likedRecipes=[];
                // let currentCompleteSchedule=[];
                // let currentProgram=undefined;
                let{username, email,password, gender , role, passwordc} = req.body;
                let user=new User( {username, email,role, gender , fileId,filePath,fileUrl});
                let newUser =await User.register(user, password);

                res.status(201).json({msg: "New user added"});
                return;
              }
            });
          });
        // let user=new User( {username, email,role, gender});
        // // let user=await User.create({username, email,role, gender });
        // let newUser =await User.register(user, password);
        // res.status(201).json({msg: "New user added"});
        // return;
    }catch(e){
        res.status(400).json({msg: "Something went wrong..."});
    }
    
})
let modify=(req,res,next)=>{
    let {username, password}=req.body.data;
    req.body.username=username;
    req.body.password=password;
    next();
}
router.post('/login',modify,
passport.authenticate('local', { failureRedirect: '/login', failureMessage: true }),
function(req, res) {
    
    res.status(201).json({msg: "You are logged in"});

  },
  );

  router.get('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.status(201).json({msg: "You are logged out"});
    });
});


module.exports=router;
