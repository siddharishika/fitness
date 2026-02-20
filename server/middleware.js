const User = require('./models/User');
const FitnessVideo = require('./models/videoModel');
const {videoSchema} = require('./schema');
const Program = require('./models/Program');
const Recipe = require('./models/Recipe');
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

const isNotCoach = async (req, res, next) => {
  let coach = req.user._id;
  let user = await User.findById(coach);
  if (user.role == "coach") {
    console.log("You are a coach");
    res.status(200).send({
      success: false,
      message: "You are a coach",
    });
    return;
  }
  console.log("You are not a coach");
  next();
};

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

const isNotVideoAuthor = async (req, res, next) => {
  let { id } = req.params;
  let found = await FitnessVideo.findById(id);
  if (req.user._id.equals(found.coach)) {
    console.log("You are the author of this video, so cant review or rate");
    res.status(200).send({
      success: false,
      message: "You are the author of this video, so cant review or rate",
    });
    return;
  } else {
      console.log("You are not author of this video");
      next();

  }
};

const isNotProgramAuthor = async (req, res, next) => {
  let { id } = req.params;
  let found = await Program.findById(id);
  if (req.user._id.equals(found.coach)) {
    console.log("You are the author of this program, so cant review or rate");
    res.status(200).send({
      success: false,
      message: "You are the author of this program, so cant review or rate",
    });
    return;
  } else {
      console.log("You are not author of this program");
      next();

  }
};
const isProgramAuthor = async (req, res, next) => {
  let { id } = req.params;
  let found = await Program.findById(id);
  if (req.user._id.equals(found.coach)) {
    console.log("You are the author of this program");
    next();
  } else {
      console.log("You are not author of this program");
      res.status(200).send({
      success: false,
      message: "You are the NOT the author of this program, so cant edit or delete it",
      });
      return;

  }
};

const isNotRecipeOwner = async (req, res, next) => {
  let { id } = req.params;
  let found = await Recipe.findById(id); 
  console.log("Found recipe user", found.user); 
  if (req.user._id.equals(found.user)) {
    console.log("You are the author of this recipe");
    res.status(200).send({
        success: false,
        message: "You are the author of this recipe"
      });
    return;
  } else {
      console.log("You are not author of this recipe");
      next();  
  }
};  

const isRecipeOwner = async (req, res, next) => {
  let { id } = req.params;
  let found = await Recipe.findById(id); 
  console.log("Found recipe user", found.user); 
  if (req.user._id.equals(found.user)) {
    console.log("You are the author of this recipe");
    next();
  } else {
    res.status(200).send({
      success: false,
      message: "You are not the author of this recipe"
    });
    return; 
  }
};  


module.exports = {
  validateVideo,
  isLoggedIn,
  isCoach,
  isVideoAuthor,
  isNotVideoAuthor,
  isNotCoach,
  isNotProgramAuthor,
  isProgramAuthor,
  isNotRecipeOwner,
  isRecipeOwner,
};