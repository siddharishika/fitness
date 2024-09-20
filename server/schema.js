const Joi = require('joi');

const videoSchema = Joi.object({
    name: Joi.string().required().trim().min(3).max(30) , 
    fileId: Joi.string().min(0).required() , 
    filePath: Joi.string().trim().min(0).required() , 
    fileUrl: Joi.string().trim().min(0).required(),
    tags: Joi.array().items(Joi.string().trim().min(3).max(30)),
    // users: joi.array().items(joi.string()).required()
    coach: Joi.string().trim(),
    imgFileId: Joi.string().min(0).required() , 
    imgFilePath: Joi.string().trim().min(0).required() , 
    imgFileUrl: Joi.string().trim().min(0).required(),
})


module.exports={videoSchema };