const User = require('./models/User');
const FitnessVideo = require('./models/videoModel');
const {videoSchema} = require('./schema');

//console.log(productSchema);
const validateVideo=(req,res,next)=>{
    let {formData} =req.body;
    let { name,fileId ,tags, filePath, fileUrl , imgFileId, imgFilePath, imgFileUrl}=formData;
    const {error} =videoSchema.validate({ name,fileId ,tags, filePath, fileUrl,imgFileId,imgFileUrl,imgFilePath});
    console.log(error);
    if(error){
        let ans=error.details.map((err)=>{
             return err.message
        }).join(',');
        res.status(400).json({msg: "Something went wrong..."},{err : ans});
        
    }
    next();
}
const isLoggedIn = (req,res,next)=>{
    
    if(req.xhr && !req.isAuthenticated()){
        //req.isAuthenticated() will return true if user is logged in
        // req.flash('error' , 'You need to login first');
        //res.redirect('/login');
        console.log("Login first")
        // return res.error({msg : 'You need to login first'});
        // res.status(201).json({msg: "LOGIN"});
        // return res.redirect('http://localhost:5173/login');
        res.status(200).send({
            success: false,
            message: 'You need to be authenticated to access this page!'
          })
          return;
    }
    if(!req.isAuthenticated()){
        //req.isAuthenticated() will return true if user is logged in
       console.log("Login first")
        // req.flash('error' , 'You need to login first');
        // return res.redirect('http://localhost:5173/login');
         res.status(200).send({
            success: false,
            message: 'You need to be authenticated to access this page!'
          })
        // res.status(201).json({msg: "LOGIN"});\
        return;
    }
    next();
}


const isCoach=async(req,res,next)=>{
    let coach=req.user._id;
    let user=await User.findById(coach);
    if(user.role !== 'coach'){
        console.log("You are not a coach")
        res.status(200).send({
            success: false,
            message: 'You need to be a coach to access this page!'
          })
        return;
    }
    console.log("You are a coach");
    next();
}

const isVideoAuthor =async(req,res,next)=>{
    let {id} = req.params;
    let found=await FitnessVideo.findById(id);
    if(req.user._id.equals(found.coach)){
        console.log("You are author of this video")
        next();
    }else{
        res.status(200).send({
            success: false,
            message: 'You are not author of this video'
          })
        return;
    }
    
}


module.exports={validateVideo ,isLoggedIn , isCoach ,isVideoAuthor};