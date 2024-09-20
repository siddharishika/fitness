const multer = require('multer');
const fs = require('fs');
const imagekit = require('../utils/imageKit');
const storage = multer.memoryStorage();
const catchAsync=require('../utils/catchAsync')




const fileFilter = (req, file, cb) => {
  if (file.mimetype.split('/')[0] === 'video') {
    cb(null, true);
  } else {
    cb(new Error('Only videos are allowed!'));
  }
};
const upload = multer({ storage, fileFilter });

exports.uploadVideoFiles = upload.fields([
  {
    name: 'fitnessVideo',
    maxCount: 1,
  },
  // {
  //   name: 'name',
  //   maxCount: 1,
  // },
  
]);
exports.createVideo = catchAsync(async (req, res, next) => {
  // if (
  //   !req.files.video[0].filename ||
    
  //   !req.body.name
  // ) {
  //   return next(new AppError('👎 Something is missing', 400));
  // }
  const filePath = req.body.fitnessVideo;
  // fs.readFile(filePath, function (err, data) {
  //   if (err) throw err;
  // });
  res.send("hello world");
  // const videoKit = await imagekit.upload({
  //   file: req.files.video[0].buffer,
  //   fileName: req.files.video[0].filename,
  //   folder: 'fitness/fitnessvideo',
  // });

  // const videoData = {};

  // videoData.name = req.body.name;
  // videoData.coach = req.user.id;
  // videoData.video = videoKit.url;

  // const video = await FitnessVideo.create(videoData);

  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     video,
  //   },
  // });
});


// const upload = multer({ storage, fileFilter });
