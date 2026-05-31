const express = require("express");
const videoController = require("../controller/videoController");
const router = express.Router();
const FitnessVideo = require("../models/videoModel");
const User = require("../models/User");
const passport = require("passport");
const multer = require("multer");
const imagekit = require("../utils/imageKitCredentials");
const upload = multer({ dest: "files/" });
const fs = require("fs");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);
const { isLoggedIn } = require("../middleware");
const { deleteUserAccount } = require("../utils/deleteUserAccount");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(value) {
  return EMAIL_PATTERN.test(String(value || "").trim());
}

router.post(
  "/signup",
  upload.fields([{ name: "profilePicture", maxCount: 1 }]),
  async (req, res) => {
    try {
      const file = req.files?.profilePicture?.[0];
      if (!file) {
        return res.status(400).json({ msg: "Profile picture is required." });
      }

      const username = (req.body.username || req.body.name || "").trim();
      const email = (req.body.email || "").trim();
      const password = req.body.password;
      const gender = req.body.gender;
      const role = req.body.role || "user";

      if (!username) {
        return res.status(400).json({ msg: "Username is required." });
      }
      if (!email || !password || !gender) {
        return res
          .status(400)
          .json({ msg: "Please fill in all required fields." });
      }

      const data = await readFile(file.path);
      const result = await new Promise((resolve, reject) => {
        imagekit.upload(
          {
            file: data,
            fileName: "User" + username,
            folder: "/user",
          },
          (error, uploadResult) => {
            if (error) reject(error);
            else resolve(uploadResult);
          },
        );
      });

      const user = new User({
        username,
        email,
        role,
        gender,
        fileId: result.fileId,
        filePath: result.filePath,
        fileUrl: result.url,
      });
      await User.register(user, password);
      res.status(201).json({ msg: "New user added" });
    } catch (e) {
      res.status(400).json({ msg: e.message || "Something went wrong..." });
    }
  },
);

let modify = (req, res, next) => {
  let { username, password } = req.body.data;
  req.body.username = username;
  req.body.password = password;
  next();
};
router.post("/login", modify, (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ msg: "Unauthorized credentials" });
    }
    req.logIn(user, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }
      res.status(201).json({ msg: "You are logged in" });
    });
  })(req, res, next);
});

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.status(201).json({ msg: "You are logged out" });
  });
});

router.get("/me", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.json({ user: null });
  }
  const { _id, username, email, role, fileUrl } = req.user;
  res.json({ user: { _id, username, email, role, fileUrl } });
});

router.patch(
  "/edituser",
  isLoggedIn,
  upload.fields([{ name: "profilePicture", maxCount: 1 }]),
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ msg: "User not found." });
      }

      const username = (req.body.username || "").trim();
      const email = (req.body.email || "").trim();
      const gender = req.body.gender;
      const role = req.body.role;
      const password = req.body.password || "";
      const passwordc = req.body.passwordc || "";
      const emailConfirm = (req.body.emailConfirm || "").trim();

      if (!username || !email || !gender) {
        return res
          .status(400)
          .json({ msg: "Username, email, and gender are required." });
      }

      if (!isValidEmail(email)) {
        return res
          .status(400)
          .json({ msg: "Please enter a valid email address." });
      }

      if (email !== emailConfirm) {
        return res.status(400).json({ msg: "Emails do not match." });
      }

      if (username !== user.username) {
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
          return res.status(400).json({ msg: "Username is already taken." });
        }
      }

      if (email !== user.email) {
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
          return res.status(400).json({ msg: "Email is already in use." });
        }
      }

      if (password || passwordc) {
        if (!password || !passwordc) {
          return res
            .status(400)
            .json({ msg: "Please enter and confirm your new password." });
        }
        if (password !== passwordc) {
          return res.status(400).json({ msg: "Passwords do not match." });
        }
        await user.setPassword(password);
      }

      user.username = username;
      user.email = email;
      user.gender = gender;
      if (role === "coach" || role === "user") {
        user.role = role;
      }

      const file = req.files?.profilePicture?.[0];
      if (file) {
        const data = await readFile(file.path);
        const result = await new Promise((resolve, reject) => {
          imagekit.upload(
            {
              file: data,
              fileName: "User" + username,
              folder: "/user",
            },
            (error, uploadResult) => {
              if (error) reject(error);
              else resolve(uploadResult);
            },
          );
        });

        if (user.fileId) {
          imagekit.deleteFile(user.fileId, () => {});
        }

        user.fileId = result.fileId;
        user.filePath = result.filePath;
        user.fileUrl = result.url;
      }

      await user.save();

      res.status(200).json({
        msg: "Account updated",
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          fileUrl: user.fileUrl,
          gender: user.gender,
        },
      });
    } catch (e) {
      res.status(400).json({ msg: e.message || "Something went wrong..." });
    }
  },
);

router.delete("/deleteaccount", isLoggedIn, async (req, res, next) => {
  try {
    await deleteUserAccount(req.user._id);
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.status(200).json({ msg: "Account deleted" });
    });
  } catch (e) {
    res.status(e.statusCode || 400).json({
      msg: e.message || "Something went wrong...",
    });
  }
});

module.exports = router;
