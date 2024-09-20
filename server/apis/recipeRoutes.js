const express=require('express');
const FitnessVideo = require('../models/videoModel');
const Program = require('../models/Program');
const { isLoggedIn } = require('../middleware');
const Recipe = require('../models/Recipe');
const User = require('../models/User');
const router=express.Router();


router.post('/addrecipe',isLoggedIn, async(req,res)=>{
    
    try{
       let {name,process, description, tags, timeRequired , ingredients, photo}=req.body;
    let user=req.user._id;
       await Recipe.create({name,process, description, tags, timeRequired , ingredients, photo,user})
        res.status(201).json({msg: "Gotcha"} );
    }catch(e){
        res.status(400).json({msg: "Something went wrong..." });
    }
})

router.get('/allrecipes',async(req,res)=>{
    
    try{
        
        let recipes=await Recipe.find({});
        // let coach=fitnessVideos
        // let coach=await User.find({});

        // fitnessVideos=await fitnessVideos.populate('coach');
        res.status(201).json({msg: "Gotcha",data:recipes});
    }catch(e){
        res.status(400).json({msg: "Something went wrong..." });

    }
})


router.delete('/deleterecipe/:id',isLoggedIn ,async (req,res)=>{
    try {
        let id=req.params.id;
        
        let response=await Recipe.findByIdAndDelete(id);
        res.status(201).json({msg: "Gotcha" });
    } catch (e) {
        res.status(400).json({msg: "Something went wrong..." });
    }
})



router.post('/changerecipelike',isLoggedIn, async(req,res)=>{
    try{
        let recipe=req.body;
        let user=req.user;
        let arr=[];
        let flag=false;
        for(let i=0;i<user.likedRecipes.length;i++){
             if(recipe._id.toString()==(user.likedRecipes[i].toString())){
                 flag=true;
                 break;
             }
        }
 
        if(flag){
         for(let i=0;i<user.likedRecipes.length;i++){
             if(user.likedRecipes[i] && recipe._id.toString()!=(user.likedRecipes[i].toString())){
                 arr.push(user.likedRecipes[i]);
             }
         }
        }else{
         arr=[...user.likedRecipes];
         arr.push(recipe._id);
        }
        let result=await User.updateOne({_id: user._id}, {likedRecipes: arr});
        res.status(201).json({msg: "Gotcha" } );
      }catch(e){
          res.status(400).json({msg: "Something went wrong..." });
      }
})

router.get('/getlikedrecipes',isLoggedIn, async(req,res)=>{
    try {
        let user=req.user;
        let result=await User.findById(user._id).populate('likedRecipes').exec();

        res.status(201).json({msg: "Gotcha" ,  data:result} );
    } catch (e) {
        res.status(400).json({msg: "Something went wrong..."});
    }
})


router.get('/getmyrecipes',isLoggedIn, async(req,res)=>{
    try {
        let user=req.user;
        let result=await Recipe.find({user:user._id});

        res.status(201).json({msg: "Gotcha" ,  data:result} );
    } catch (e) {
        res.status(400).json({msg: "Something went wrong..."});
    }
})


module.exports=router;