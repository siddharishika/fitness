const User = require("./models/User");
const FitnessVideo = require("./models/videoModel");
const { videoSchema } = require("./schema");
const Program = require("./models/Program");
const Recipe = require("./models/Recipe");
const validateVideo = (req, res, next) => {
  let { formData } = req.body;
  let {
    name,
    fileId,
    tags,
    filePath,
    fileUrl,
    imgFileId,
    imgFilePath,
    imgFileUrl,
  } = formData;
  const { error } = videoSchema.validate({
    name,
    fileId,
    tags,
    filePath,
    fileUrl,
    imgFileId,
    imgFileUrl,
    imgFilePath,
  });
  if (error) {
    let ans = error.details
      .map((err) => {
        return err.message;
      })
      .join(",");
    res.status(400).json({ msg: "Something went wrong..." }, { err: ans });
  }
  next();
};
const isLoggedIn = (req, res, next) => {
  if (req.xhr && !req.isAuthenticated()) {
    res.status(200).send({
      success: false,
      message: "You need to be authenticated to access this page!",
    });
    return;
  }
  if (!req.isAuthenticated()) {
    res.status(200).send({
      success: false,
      message: "You need to be authenticated to access this page!",
    });
    return;
  }
  next();
};

const isCoach = async (req, res, next) => {
  let coach = req.user._id;
  let user = await User.findById(coach);
  if (user.role !== "coach") {
    res.status(200).send({
      success: false,
      message: "You need to be a coach to access this page!",
    });
    return;
  }
  next();
};

const isNotCoach = async (req, res, next) => {
  let coach = req.user._id;
  let user = await User.findById(coach);
  if (user.role == "coach") {
    res.status(200).send({
      success: false,
      message: "You are a coach",
    });
    return;
  }
  next();
};

const isVideoAuthor = async (req, res, next) => {
  const mongoose = require("mongoose");
  const id = req.params.id || req.body.id;
  if (!id || !mongoose.Types.ObjectId.isValid(String(id))) {
    return res.status(400).send({
      success: false,
      message: "Video id is required",
    });
  }
  let found = await FitnessVideo.findById(id);
  if (!found) {
    return res.status(404).send({
      success: false,
      message: "Video not found",
    });
  }
  if (req.user._id.equals(found.coach)) {
    next();
  } else {
    res.status(403).send({
      success: false,
      message: "You are not author of this video",
    });
    return;
  }
};

const AUTHOR_OWN_CONTENT_MESSAGE =
  "You cannot rate or review your own content.";

const isNotVideoAuthor = async (req, res, next) => {
  let { id } = req.params;
  let found = await FitnessVideo.findById(id);
  if (!found) {
    return res.status(404).send({
      success: false,
      message: "Video not found",
    });
  }
  if (req.user._id.equals(found.coach)) {
    return res.status(403).send({
      success: false,
      message: AUTHOR_OWN_CONTENT_MESSAGE,
    });
  }
  next();
};

const isNotProgramAuthor = async (req, res, next) => {
  let { id } = req.params;
  let found = await Program.findById(id);
  if (!found) {
    return res.status(404).send({
      success: false,
      message: "Program not found",
    });
  }
  if (req.user._id.equals(found.coach)) {
    return res.status(403).send({
      success: false,
      message: AUTHOR_OWN_CONTENT_MESSAGE,
    });
  }
  next();
};
const isProgramAuthor = async (req, res, next) => {
  const id = req.params.id || req.body.id;
  if (!id) {
    return res.status(400).send({
      success: false,
      message: "Program id is required",
    });
  }
  let found = await Program.findById(id);
  if (!found) {
    return res.status(404).send({
      success: false,
      message: "Program not found",
    });
  }
  if (req.user._id.equals(found.coach)) {
    next();
  } else {
    res.status(200).send({
      success: false,
      message:
        "You are the NOT the author of this program, so cant edit or delete it",
    });
    return;
  }
};

const isNotRecipeOwner = async (req, res, next) => {
  let { id } = req.params;
  let found = await Recipe.findById(id);
  if (!found) {
    return res.status(404).send({
      success: false,
      message: "Recipe not found",
    });
  }
  if (req.user._id.equals(found.user)) {
    return res.status(403).send({
      success: false,
      message: AUTHOR_OWN_CONTENT_MESSAGE,
    });
  }
  next();
};

const isRecipeOwner = async (req, res, next) => {
  const id = req.params.id || req.body._id || req.body.id;
  if (!id) {
    return res.status(400).send({
      success: false,
      message: "Recipe id is required",
    });
  }
  let found = await Recipe.findById(id);
  if (!found) {
    return res.status(404).send({
      success: false,
      message: "Recipe not found",
    });
  }
  if (req.user._id.equals(found.user)) {
    next();
  } else {
    res.status(200).send({
      success: false,
      message: "You are not the author of this recipe",
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
