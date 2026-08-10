require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const cors = require("cors");
const multer = require("multer");
const uploadRoutes = require("./apis/uploadRoute");
const bodyParser = require("body-parser");
const { MongoClient, ServerApiVersion } = require("mongodb");
const sharp = require("sharp");
const ImageKit = require("imagekit");
const imagekitAuth = require("./utils/imageKitCredentials");
const LocalStrategy = require("passport-local");
const passport = require("passport");

const passportLocalMongoose = require("passport-local-mongoose");
const User = require("./models/User");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const uri = process.env.MONGO_URI;
const PORT = process.env.PORT || 8080;

const videoRoutes = require("./apis/videoRoutes");
const authRoutes = require("./apis/authRoute");
const programRoutes = require("./apis/programRoutes");
const recipeRoutes = require("./apis/recipeRoutes");
const myJourneyRoutes = require("./apis/myJourney");

app.use(express.static(path.join(__dirname, "../client/dist")));

const allowedOrigins = [
  "http://localhost:5173",
  "https://fitness-social.onrender.com",
  "https://fitnesssocial.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  }),
);

app.use(methodOverride("_method"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate("session"));
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(uploadRoutes);
app.use(videoRoutes);
app.use(authRoutes);
app.use(programRoutes);
app.use(recipeRoutes);
app.use(myJourneyRoutes);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });

const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    process.stderr.write(
      `Port ${PORT} is already in use. Stop the other server (lsof -ti :${PORT} | xargs kill) or use that instance.\n`,
    );
    process.exit(1);
  }
  throw err;
});
