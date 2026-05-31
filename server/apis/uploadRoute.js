const express = require("express");
const videoController = require("../controller/videoController");
const router = express.Router();
const FitnessVideo = require("../models/videoModel");
const { validateVideo } = require("../middleware");
const FormData = require("form-data");
const multer = require("multer");
const upload = multer({ dest: "files/" });

const fs = require("fs");
const imagekit = require("../utils/imageKitCredentials");
const { isLoggedIn, isCoach } = require("../middleware");

router.post(
  "/add",
  isLoggedIn,
  isCoach,
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "imgFile", maxCount: 1 },
  ]),
  async (req, res) => {
    var { name, tags } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ msg: "Video title is required." });
    }
    if (!req.files?.file?.[0]) {
      return res.status(400).json({ msg: "Workout video file is required." });
    }
    if (!req.files?.imgFile?.[0]) {
      return res.status(400).json({ msg: "Thumbnail photo is required." });
    }

    let arr = tags.split(",");

    fs.readFile(req.files.file[0].path, async function (err, data) {
      if (err) throw err;
      imagekit.upload(
        {
          file: data,
          fileName: `${String(name).trim().replace(/\s+/g, "_")}.mp4`,
          folder: "/fitness",
        },
        async function (error, result) {
          if (error) return;
          fs.readFile(req.files.imgFile[0].path, async function (err, data2) {
            if (err) throw err;
            imagekit.upload(
              {
                file: data2,
                fileName: name + "img",
                folder: "/fitnessImages",
              },
              async function (error, result2) {
                if (error) return;
                let fileId = result.fileId;
                let filePath = result.filePath;
                let fileUrl = result.url;
                let imgFileId = result2.fileId;
                let imgFilePath = result2.filePath;
                let imgFileUrl = result2.url;
                let coach = req.user._id;
                try {
                  await FitnessVideo.create({
                    name,
                    fileId,
                    tags: arr,
                    filePath,
                    fileUrl,
                    coach,
                    imgFileId,
                    imgFileUrl,
                    imgFilePath,
                  });
                  res.status(201).json({ msg: "New video added" });
                } catch (e) {
                  res.status(400).json({ msg: "Something went wrong..." });
                }
              },
            );
          });
        },
      );
    });
  },
);

module.exports = router;
