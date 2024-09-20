const ImageKit = require('imagekit');
const fs = require('fs');
const express=require('express');
const router=express.Router();
const imagekit=require('./imageKitCredentials');

router.get('/auth' , (req,res,next)=>{
  authenticationParameters = imagekit.getAuthenticationParameters();
  res.send(authenticationParameters);
})

module.exports = router ;