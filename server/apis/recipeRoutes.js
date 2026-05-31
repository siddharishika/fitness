const express = require("express");
const FitnessVideo = require("../models/videoModel");
const Program = require("../models/Program");
const {
  isLoggedIn,
  isCoach,
  isNotRecipeOwner,
  isRecipeOwner,
} = require("../middleware");
const Recipe = require("../models/Recipe");
const User = require("../models/User");
const { route } = require("./uploadRoute");
const { deleteImageKitFileByUrl } = require("../utils/imageKitCleanup");
const router = express.Router();

async function deleteRecipePhotoFromImageKit(photoUrl) {
  await deleteImageKitFileByUrl(photoUrl);
}

router.post("/addrecipe", isLoggedIn, isCoach, async (req, res) => {
  try {
    let { name, process, description, tags, timeRequired, ingredients, photo } =
      req.body;
    let user = req.user._id;
    let tagsArr = [];
    if (Array.isArray(tags))
      tagsArr = tags.map((t) => String(t).trim()).filter(Boolean);
    else if (typeof tags === "string")
      tagsArr = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

    let processArr = [];
    if (Array.isArray(process))
      processArr = process.map((p) => String(p).trim()).filter(Boolean);
    else if (typeof process === "string")
      processArr = process
        .split(/\r?\n|;|,/)
        .map((p) => p.trim())
        .filter(Boolean);

    let ingredientsArr = [];
    if (Array.isArray(ingredients)) {
      ingredientsArr = ingredients.map((it) => ({
        ingredient: String(it.ingredient || it.name || "").trim(),
        amount: String(it.amount || "").trim(),
      }));
    }

    if (!photo) {
      photo =
        "https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=1498&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
    }
    const newRecipe = await Recipe.create({
      name,
      process: processArr,
      description,
      tags: tagsArr,
      timeRequired: Number(timeRequired) || 0,
      ingredients: ingredientsArr,
      photo,
      user,
    });
    res.status(201).json({ msg: "Gotcha", data: newRecipe });
  } catch (e) {
    const response = { msg: "Something went wrong..." };
    if (e.name === "ValidationError" && e.errors) {
      response.validation = Object.keys(e.errors).map((k) => ({
        field: k,
        message: e.errors[k].message,
      }));
    } else if (e.code === 11000) {
      response.duplicateKey = e.keyValue;
    } else {
      response.error = e.message;
    }
    res.status(400).json(response);
  }
});

router.get("/allrecipes", async (req, res) => {
  try {
    let recipes = await Recipe.find({})
      .populate("user")
      .populate("reviews.user");

    res.status(201).json({ msg: "Gotcha", data: recipes });
  } catch (e) {
    res.status(400).json({ msg: "Something went wrong..." });
  }
});

router.get("/allrecipes/:tag", async (req, res) => {
  try {
    let tag = req.params.tag;
    let recipes = await Recipe.find({ tags: tag })
      .populate("user")
      .populate("reviews.user");
    res.status(200).json({ msg: "Gotcha", data: recipes });
  } catch (e) {
    res.status(400).json({ msg: "Something went wrong..." });
  }
});

router.get("/showrecipe/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate("user")
      .populate("reviews.user");
    if (!recipe) {
      return res.status(404).json({ msg: "Recipe not found" });
    }
    res.status(200).json({ msg: "Gotcha", data: recipe });
  } catch (e) {
    res.status(400).json({ msg: "Something went wrong..." });
  }
});

router.delete(
  "/deleterecipe/:id",
  isLoggedIn,
  isCoach,
  isRecipeOwner,
  async (req, res) => {
    try {
      let id = req.params.id;
      const recipe = await Recipe.findById(id);
      if (!recipe) {
        return res.status(404).json({ msg: "Recipe not found" });
      }
      await deleteRecipePhotoFromImageKit(recipe.photo);
      await Recipe.findByIdAndDelete(id);
      res.status(201).json({ msg: "Gotcha" });
    } catch (e) {
      res.status(400).json({ msg: "Something went wrong..." });
    }
  },
);

router.post("/changerecipelike", isLoggedIn, async (req, res) => {
  try {
    let recipe = req.body;
    let user = req.user;
    let arr = [];
    let flag = false;
    for (let i = 0; i < user.likedRecipes.length; i++) {
      if (recipe._id.toString() == user.likedRecipes[i].toString()) {
        flag = true;
        break;
      }
    }

    if (flag) {
      for (let i = 0; i < user.likedRecipes.length; i++) {
        if (
          user.likedRecipes[i] &&
          recipe._id.toString() != user.likedRecipes[i].toString()
        ) {
          arr.push(user.likedRecipes[i]);
        }
      }
    } else {
      arr = [...user.likedRecipes];
      arr.push(recipe._id);
    }
    let result = await User.updateOne({ _id: user._id }, { likedRecipes: arr });
    res.status(201).json({ msg: "Gotcha" });
  } catch (e) {
    res.status(400).json({ msg: "Something went wrong..." });
  }
});

router.get("/getlikedrecipes", isLoggedIn, async (req, res) => {
  try {
    let user = req.user;
    let result = await User.findById(user._id).populate("likedRecipes").exec();

    res.status(201).json({ msg: "Gotcha", data: result });
  } catch (e) {
    res.status(400).json({ msg: "Something went wrong..." });
  }
});

router.get("/getmyrecipes", isLoggedIn, async (req, res) => {
  try {
    let user = req.user;
    let result = await Recipe.find({ user: user._id })
      .populate("reviews.user")
      .exec();

    res.status(201).json({ msg: "Gotcha", data: result });
  } catch (e) {
    res.status(400).json({ msg: "Something went wrong..." });
  }
});

router.patch(
  "/recipe/addrating/:id",
  isLoggedIn,
  isNotRecipeOwner,
  async (req, res) => {
    try {
      const userId = req.user._id;
      const id = req.params.id;
      let { userRating, newRating, newRatingCount } = req.body;

      userRating = Number(userRating);
      newRating = Number(newRating);
      newRatingCount = Number(newRatingCount);
      let found = await Recipe.findById(id);
      for (let i = 0; i < found.rating.length; i++) {
        if (found.rating[i].user.toString() === userId.toString()) {
          return res
            .status(400)
            .json({ msg: "You have already rated this recipe" });
        }
      }
      const updated = await Recipe.findByIdAndUpdate(
        id,
        {
          $push: { rating: { userRating, user: userId } },
          currentRating: newRating,
          currentRatingCount: newRatingCount,
        },
        { new: true },
      );

      res.status(201).json({ msg: "Gotcha", data: updated });
    } catch (e) {
      res.status(400).json({ msg: "Something went wrong..." });
    }
  },
);

router.post(
  "/deleterecipe/:id",
  isLoggedIn,
  isCoach,
  isRecipeOwner,
  async (req, res) => {
    try {
      let id = req.params.id;
      const recipe = await Recipe.findById(id);
      if (!recipe) {
        return res.status(404).json({ msg: "Recipe not found" });
      }
      await deleteRecipePhotoFromImageKit(recipe.photo);
      await Recipe.findByIdAndDelete(id);
      res.status(201).json({ msg: "Gotcha" });
    } catch (e) {
      res.status(400).json({ msg: "Something went wrong..." });
    }
  },
);

router.post("/edit", isLoggedIn, isCoach, isRecipeOwner, async (req, res) => {
  try {
    let { name, process, description, tags, timeRequired, ingredients, photo } =
      req.body;
    let user = req.user._id;
    const existingRecipe = await Recipe.findOne({ user, _id: req.body._id });
    if (!existingRecipe) {
      return res.status(404).json({ msg: "Recipe not found" });
    }
    let tagsArr = [];
    if (Array.isArray(tags))
      tagsArr = tags.map((t) => String(t).trim()).filter(Boolean);
    else if (typeof tags === "string")
      tagsArr = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

    let processArr = [];
    if (Array.isArray(process))
      processArr = process.map((p) => String(p).trim()).filter(Boolean);
    else if (typeof process === "string")
      processArr = process
        .split(/\r?\n|;|,/)
        .map((p) => p.trim())
        .filter(Boolean);

    let ingredientsArr = [];
    if (Array.isArray(ingredients)) {
      ingredientsArr = ingredients.map((it) => ({
        ingredient: String(it.ingredient || it.name || "").trim(),
        amount: String(it.amount || "").trim(),
      }));
    }

    if (!photo) {
      photo =
        "https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=1498&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
    }
    if (photo !== existingRecipe.photo) {
      await deleteRecipePhotoFromImageKit(existingRecipe.photo);
    }
    const newRecipe = await Recipe.findOneAndUpdate(
      { user: user._id, _id: req.body._id },
      {
        name,
        process: processArr,
        description,
        tags: tagsArr,
        timeRequired: Number(timeRequired) || 0,
        ingredients: ingredientsArr,
        photo,
      },
      { new: true },
    );
    res.status(201).json({ msg: "Gotcha", data: newRecipe });
  } catch (e) {
    const response = { msg: "Something went wrong..." };
    if (e.name === "ValidationError" && e.errors) {
      response.validation = Object.keys(e.errors).map((k) => ({
        field: k,
        message: e.errors[k].message,
      }));
    } else if (e.code === 11000) {
      response.duplicateKey = e.keyValue;
    } else {
      response.error = e.message;
    }
    res.status(400).json(response);
  }
});

router.post(
  "/recipe/addreview/:id",
  isLoggedIn,
  isNotRecipeOwner,
  async (req, res) => {
    try {
      const userId = req.user._id;
      const id = req.params.id;
      let { review } = req.body;
      review = review.trim();
      if (review.length === 0) {
        return res.status(400).json({ msg: "Review cannot be empty" });
      }
      let found = await Recipe.findById(id);
      found.reviews.push({ review, user: userId });
      await found.save();
      res.status(201).json({ msg: "Gotcha", data: found });
    } catch (e) {
      res.status(400).json({ msg: "Something went wrong..." });
    }
  },
);

module.exports = router;

