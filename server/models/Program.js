const mongoose = require("mongoose");

const programSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A video must have a name"],
    trim: true,
    unique: true,
    minLength: [3, "video name must be more that 3 characters"],
    maxLength: [30, "video name must be at most 30 characters"],
  },
  numberOfDays: {
    type: Number,
    required: [true, "A video must have a name"],
    trim: true,
  },
  tags: [
    {
      type: String,

      trim: true,

      minLength: [3, "program tag must be more that 3 characters"],
      maxLength: [30, "program tag must be at most 30 characters"],
    },
  ],
  typeOfProgram: [
    {
      type: String,
      required: [true, "A video must have a name"],
      trim: true,
      unique: true,
      minLength: [3, "program name must be more that 3 characters"],
      maxLength: [30, "program name must be at most 30 characters"],
    },
  ],
  equipment: [
    {
      type: String,
      trim: true,
      unique: true,
      minLength: [3, "equipment name must be more that 3 characters"],
      maxLength: [30, "equipment name must be at most 30 characters"],
    },
  ],
  schedule: [
    [
      {
        type: mongoose.Schema.ObjectId,
        ref: "FitnessVideo",
      },
    ],
  ],
  timePerDay: {
    type: Number,
    min: 0,
  },
  description: {
    type: String,
    trim: true,
    unique: true,
    minLength: [3, "program description must be more that 3 characters"],
    maxLength: [300, "program description must be at most 300 characters"],
  },
  coach: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "A program must belong to an coach"],
  },
  rating: [
    {
      userRating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    },
  ],
  currentRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  currentRatingCount: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      review: {
        type: String,
        trim: true,
      },
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    },
    {
      timestamps: true,
    },
  ],
  file: {
    type: String,
    default:
      "https://plus.unsplash.com/premium_photo-1670505060574-b08479270d1b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
});

const Program = mongoose.model("Program", programSchema);

module.exports = Program;
