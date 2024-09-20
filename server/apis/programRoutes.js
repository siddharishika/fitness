const express=require('express');
const FitnessVideo = require('../models/videoModel');
const Program = require('../models/Program');
const { isLoggedIn } = require('../middleware');
const User = require('../models/User');
const router=express.Router();


router.post('/addprogram',isLoggedIn, async(req,res)=>{
    
    try{
        let {name,numberOfDays, schedule, equipment, typeOfProgram, description, timePerDay }=req.body;
        let coach=req.user._id;
        let fitnessVideos=await FitnessVideo.find({})
        let arr=[];
        for(let i=0;i<numberOfDays;i++){
            arr.push([]);
            for(let j=0;j<fitnessVideos.length;j++){
                if(schedule[i][j]){
                    arr[i].push(fitnessVideos[j]._id);
                }
            }
            
        }
        await Program.create( {coach, name,numberOfDays, schedule:arr, equipment, typeOfProgram, description, timePerDay });

        res.status(201).json({msg: "Gotcha"} );
    }catch(e){
        res.status(400).json({msg: "Something went wrong..." });
    }
})

router.get('/allprograms' , async(req,res)=>{
    try{
        
        let programs=await Program.find({}).populate([{path: 'schedule'}]);
        
        res.status(201).json({msg: "Gotcha",data:programs});
    }catch(e){
        res.status(400).json({msg: "Something went wrong..." });

    }
})


router.get('/showprogram/:id' , async(req,res)=>{
    // try{
        let id=req.params.id;
        let program=await Program.findById(id).populate([{path: 'schedule'}]);
        let vids=[[]]
        let sch=program.schedule;
        for(let day=0;day<sch.length;day++){
            for(let vid=0;vid<sch[day].length;vid++){
                vids[day][vid]=await FitnessVideo.findById(sch[day][vid]);
            }
        }
        let data={};
        data.program=program;
        data.vids=vids;
        // program.vids=vids;
        res.status(201).json({msg: "Gotcha",data:data});
    // }catch(e){
        // res.status(400).json({msg: "Something went wrong..." });

    // }
})

router.patch('/editprogram' , isLoggedIn , async(req,res)=>{
    try{
        let {id, name,numberOfDays, schedule, equipment, typeOfProgram, description, timePerDay }=req.body;
        let coach=req.user._id;
        
        let fitnessVideos=await FitnessVideo.find({})
        let arr=[];
        for(let i=0;i<numberOfDays;i++){
            arr.push([]);
            for(let j=0;j<fitnessVideos.length;j++){
                if(schedule[i][j]){
                    arr[i].push(fitnessVideos[j]._id);
                }
            }
            
        }
        // await Program.create( {coach, name,numberOfDays, schedule:arr, equipment, typeOfProgram, description, timePerDay });
        await Program.findByIdAndUpdate(id , {name,numberOfDays, schedule:arr, equipment, typeOfProgram, description, timePerDay})
        res.status(201).json({msg: "Gotcha"} );
    }catch(e){
        res.status(400).json({msg: "Something went wrong..." });
    }
})

router.delete('/deleteprogram/:id',isLoggedIn ,async (req,res)=>{
    try {
        let id=req.params.id;
        
        let response=await Program.findByIdAndDelete(id);
        res.status(201).json({msg: "Gotcha" });
    } catch (e) {
        res.status(400).json({msg: "Something went wrong..." });
    }
})

router.post('/changeprogramlike', isLoggedIn, async(req,res)=>{
    
    // try{
        let {program, vids}=req.body;
        let user=req.user;
        let flag=false;
        for(let i=0;i<user.likedPrograms.length;i++){
            if(user.likedPrograms[i].toString()==program._id.toString()){
                flag=true;
                break;
            }
        }
        let arr=[];
        if(flag){
            for(let i=0;i<user.likedPrograms.length;i++){
                if(user.likedPrograms[i].toString()!=program._id.toString()){
                    arr.push(user.likedPrograms[i]);
                }
            }
        }else{
            arr=[...user.likedPrograms];
            arr.push(program._id);
        }
        let result=await User.updateOne({_id: user._id}, {likedPrograms: arr});
       res.status(201).json({msg: "Gotcha" } );
    //   }catch(e){
    //       res.status(400).json({msg: "Something went wrong..." });
    //   }
})

router.get('/getlikedprograms',isLoggedIn, async(req,res)=>{
    
    try {
        let user=req.user;
        let result=await User.findById(user._id).populate('likedPrograms').exec();

        res.status(201).json({msg: "Gotcha" ,  data:result} );
    } catch (e) {
        res.status(400).json({msg: "Something went wrong..."});
    }
})

router.get('/getmyprograms',isLoggedIn, async(req,res)=>{    
    try {
        let user=req.user;
        let result=await Program.find({coach:user._id});

        res.status(201).json({msg: "Gotcha" ,  data:result} );
    } catch (e) {
        res.status(400).json({msg: "Something went wrong..."});
    }
})

module.exports=router;