require('dotenv').config();
const express =require('express');
const app=express();
const path=require('path');
const mongoose=require('mongoose');
const methodOverride = require('method-override')
const cors = require('cors')
const multer=require('multer');
const uploadRoutes=require('./apis/uploadRoute');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require("mongodb");
const sharp=require('sharp');
const ImageKit = require('imagekit');
const imagekitAuth = require('./utils/imageKitCredentials');
const LocalStrategy =require('passport-local');
const passport = require('passport');

const passportLocalMongoose =require('passport-local-mongoose');
const User=require('./models/User')
const cookieParser = require('cookie-parser')
const session = require('express-session');
const uri = process.env.MONGO_URI;
const PORT = process.env.PORT || 8080;

const videoRoutes=require('./apis/videoRoutes')
const authRoutes=require('./apis/authRoute');
const programRoutes=require('./apis/programRoutes');
const recipeRoutes=require('./apis/recipeRoutes');
const myJourneyRoutes=require('./apis/myJourney')

app.use(express.static(path.join(__dirname, "../client/dist")));


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", 
      "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });



app.use(methodOverride('_method'));


app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: false,
    cookie:{
        httpOnly : true,
        expires : Date.now() + 7*24*60*60*1000,
        maxAge : 7*24*60*60*1000
    }
  }));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('session'));
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




const allowedOrigins = [
  "http://localhost:5173", // local frontend
  "https://fitness-social.onrender.com", // deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin like Postman
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true, // allow cookies and credentials
  })
);



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
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


app.listen(PORT, ()=>{
    console.log("Server connected at port ",PORT);
})

