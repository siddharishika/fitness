const express =require('express');
const app=express();
const path=require('path');
const mongoose=require('mongoose');
const methodOverride = require('method-override')
const cors = require('cors')
const multer=require('multer');
const dotenv=require('dotenv').config();
const uploadRoutes=require('./apis/uploadRoute');
const bodyParser = require('body-parser');

const sharp=require('sharp');
const ImageKit = require('imagekit');
const LocalStrategy =require('passport-local');
const passport=require('passport');
const passportLocalMongoose =require('passport-local-mongoose');
const User=require('./models/User')
const cookieParser = require('cookie-parser')
const session = require('express-session');


const imageKitAuth = require('./utils/imageKit');
const videoRoutes=require('./apis/videoRoutes')
const authRoutes=require('./apis/authRoute');
const programRoutes=require('./apis/programRoutes');
const recipeRoutes=require('./apis/recipeRoutes');
const myJourneyRoutes=require('./apis/myJourney')

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", 
      "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

// app.use(imageKitAuth);

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




app.use(cors({
    origin : ["http://localhost:5173"],
    credentials: true,

}))


app.use(uploadRoutes);
app.use(videoRoutes);
app.use(authRoutes);
app.use(programRoutes);
app.use(recipeRoutes);
app.use(myJourneyRoutes);
mongoose.connect('mongodb://127.0.0.1:27017/fitness')
.then(()=>{
    console.log("Successfully connected to database");
})
.catch((err)=>{
    console.log(`Error ${err} connecting to database`)
})

const PORT=8080;
app.listen(PORT, ()=>{
    console.log("Server connected at port ",PORT);
})

// module.exports = {imagekit};