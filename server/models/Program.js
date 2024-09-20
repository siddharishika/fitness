const mongoose = require('mongoose');

const programSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A video must have a name'],
      trim: true,
      unique: true,
      minLength: [3, 'video name must be more that 3 characters'],
      maxLength: [30, 'video name must be at most 30 characters'],
    },
    numberOfDays: {
        type: Number,
        required: [true, 'A video must have a name'],
        trim: true,
   
       
      },
    typeOfProgram: [{
        type: String,
        required: [true, 'A video must have a name'],
        trim: true,
        unique: true,
        minLength: [3, 'video name must be more that 3 characters'],
        maxLength: [30, 'video name must be at most 30 characters'],
      }],
      equipment: [{
        type: String,
        trim: true,
        unique: true,
        minLength: [3, 'video name must be more that 3 characters'],
        maxLength: [30, 'video name must be at most 30 characters'],
      }],
    schedule:[ [{
      type: mongoose.Schema.ObjectId,
      ref: 'FitnessVideo',
    }]],
    timePerDay:{
        type: Number,
        min:0,
        
    },
    description: {
        type: String,
        trim: true,
        unique: true,
        minLength: [3, 'video name must be more that 3 characters'],
        maxLength: [300, 'video name must be at most 30 characters'],
      },
      coach: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A video must belong to an coach'],
      },
      rating:{
        type: Number,
        min:0,
        max:5,
        default: 0
      },
      reviews:[{
        review:{
            type:String,
            trim:true,
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

const Program =mongoose.model('Program', programSchema);

module.exports = Program;
