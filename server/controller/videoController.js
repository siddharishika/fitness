const multer = require("multer");
const fs = require("fs");
const imagekit = require("../utils/imageKit");
const storage = multer.memoryStorage();
const catchAsync = require("../utils/catchAsync");

const fileFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[0] === "video") {
    cb(null, true);
  } else {
    cb(new Error("Only videos are allowed!"));
  }
};
const upload = multer({ storage, fileFilter });

exports.uploadVideoFiles = upload.fields([
  {
    name: "fitnessVideo",
    maxCount: 1,
  },
]);
exports.createVideo = catchAsync(async (req, res, next) => {
  const filePath = req.body.fitnessVideo;
  res.send("hello world");
});
