const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A video must have a name'],
      trim: true,
      unique: true,
      minLength: [3, 'video name must be more that 3 characters'],
      maxLength: [100, 'video name must be at most 30 characters'],
    },
    rating:{
        type: Number,
        min: 0,
        max: 5  
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A video must belong to an coach'],
    },
    ingredients: [{
        ingredient:{
        type: String,
        required: [true, 'A video must have a name'],
        trim: true,
        minLength: [3, 'video name must be more that 3 characters'],
        maxLength: [300, 'video name must be at most 30 characters'],
      },
      amount:{
        type: String,
        required: [true, 'A video must have a name'],
        trim: true,
   
        minLength: [3, 'video name must be more that 3 characters'],
        maxLength: [30, 'video name must be at most 30 characters'],
      }}],
      description: {
        type: String,
        required: [true, 'A video must have a name'],
        trim: true,

        minLength: [3, 'video name must be more that 3 characters'],
        maxLength: [1000, 'video name must be at most 30 characters'],
      },
      process: [{
        type: String,
        required: [true, 'A video must have a name'],
        trim: true,
        unique: true,
        minLength: [3, 'video name must be more that 3 characters'],
        maxLength: [1000, 'video name must be at most 30 characters'],
      }],
      tags: [{
        type: String,

        trim: true,

        minLength: [3, 'video name must be more that 3 characters'],
        maxLength: [30, 'video name must be at most 30 characters'],
      }],
      photo: {
        type: String,
        trim: true,
      },
      timeRequired:{
        type: Number,
        min: 0,
    },
    rating:{
        type: Number,
        min:0,
        max:5,
        default:0
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

const Recipe =mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
