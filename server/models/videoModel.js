const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A video must have a name'],
      trim: true,
      unique: true,
      minLength: [3, 'video name must be more that 3 characters'],
      maxLength: [30, 'video name must be at most 30 characters'],
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
    imgFileId: {
      type: String,
      required: [true, 'An img must have a fileId'],
      
      unique: true,
      
    },
    imgFilePath: {
      type: String,
      required: [true, 'An img must have a path'],
      
      unique: true,
    },
    imgFileUrl: {
      type: String,
      required: [true, 'An img must have a url'],
      
      unique: true,
   
    },
    tags: [{
      type: String,
      
      trim: true,
      
      minLength: [3, 'video tag must be more that 3 characters'],
      maxLength: [30, 'video tag must be at most 30 characters'],
    }],
    coach: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A video must belong to an coach'],
    },
    rating:{
      type: Number,
      min: 0,
      max :5,
      default:0
    },
    reviews:[{
      review:{
        type: String,
        trim: true,
      },
      user:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      }
    }]
    // img: {
    //   type: String,
    //   required: [true, 'A song must have a cover img'],
    // },
    // plays: {
    //   type: Number,
    //   default: 0,
    // },
   
  },
//   {
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true },
//   }
);

const FitnessVideo =mongoose.model('FitnessVideo', videoSchema);

module.exports = FitnessVideo;
