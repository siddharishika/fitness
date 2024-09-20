const mongoose=require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');


const userSchema = new mongoose.Schema(
  {
    
    email: {
      type: String,
      required: true,
      unique: true,
      trim:true,
    },
    role: {
      type: String,
      default: 'user',
    },
    gender: {
      type: String,
      trim: true,
      required: true
    },
    fileId: {
      type: String,
      required: [true, 'A video must have a fileId'],
      
      unique: true,
      
    },
    filePath: {
      type: String,
      required: [true, 'A video must have a path'],
      
      unique: true,
    },
    fileUrl: {
      type: String,
      required: [true, 'A video must have a url'],
      
      unique: true,
   
    },
    likedVideos:[ {
      type: mongoose.Schema.ObjectId,
      ref: 'FitnessVideo',
    }],
    likedPrograms: [{
      type: mongoose.Schema.ObjectId,
      ref: 'Program',
    }],
    likedRecipes: [{
      type: mongoose.Schema.ObjectId,
      ref: 'Recipe',
    }],
    currentProgram:{
      type: mongoose.Schema.ObjectId,
      ref: 'Program',
    },
    currentCompleteSchedule:[{
      type: Boolean
    }],
    workoutHistory:{
      programs:[{
        type: mongoose.Schema.ObjectId,
        ref: 'Program',
      }],
      completed:[{
        type: Boolean
      }]
    },
    rating:{
      type: Number,
      min: 0,
      max: 5,
      default:0,
    },
    reviews:[{
      review:{
        type: String,
        trim: true,
        default:""
      },
      user:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        
      }
    }]

  },

);

userSchema.plugin(passportLocalMongoose);
let User =mongoose.model('User', userSchema);

module.exports = User;
