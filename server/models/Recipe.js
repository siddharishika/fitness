const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A recipe must have a name"],
    trim: true,
    unique: true,
    maxLength: [100, "recipe name must be at most 100 characters"],
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "A recipe must belong to a user"],
  },
  ingredients: [
    {
      ingredient: {
        type: String,
        required: [true, "A recipe must have an ingredient name"],
        trim: true,
        maxLength: [1500, "ingredient name must be at most 300 characters"],
      },
      amount: {
        type: String,
        required: [true, "A recipe must have an amount"],
        trim: true,
        maxLength: [30, "ingredient amount must be at most 30 characters"],
      },
    },
  ],
  description: {
    type: String,
    required: [true, "A recipe must have a description"],
    trim: true,

    maxLength: [1000, "recipe description must be at most 1000 characters"],
  },
  process: [
    {
      type: String,
      required: [true, "A recipe must have a process"],
      trim: true,
      maxLength: [1000, "recipe process must be at most 1000 characters"],
    },
  ],
  tags: [
    {
      type: String,

      trim: true,
      maxLength: [30, "recipe tag must be at most 30 characters"],
    },
  ],
  photo: {
    type: String,
    trim: true,
    default:
      "https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=1498&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  timeRequired: {
    type: Number,
    min: 0,
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

const Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
