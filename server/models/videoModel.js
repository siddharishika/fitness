const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A video must have a name"],
    trim: true,
    unique: true,
    minLength: [3, "video name must be more that 3 characters"],
    maxLength: [30, "video name must be at most 30 characters"],
  },
  fileId: {
    type: String,
    required: [true, "A video must have a fileId"],

    unique: true,
  },
  filePath: {
    type: String,
    required: [true, "A video must have a path"],

    unique: true,
  },
  fileUrl: {
    type: String,
    required: [true, "A video must have a url"],

    unique: true,
  },
  imgFileId: {
    type: String,
    required: [true, "An img must have a fileId"],

    unique: true,
  },
  imgFilePath: {
    type: String,
    required: [true, "An img must have a path"],

    unique: true,
  },
  imgFileUrl: {
    type: String,
    required: [true, "An img must have a url"],

    unique: true,
  },
  tags: [
    {
      type: String,

      trim: true,

      minLength: [3, "video tag must be more that 3 characters"],
      maxLength: [30, "video tag must be at most 30 characters"],
    },
  ],
  coach: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "A video must belong to an coach"],
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
});

const FitnessVideo = mongoose.model("FitnessVideo", videoSchema);

module.exports = FitnessVideo;
