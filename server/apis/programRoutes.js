const express=require('express');
const FitnessVideo = require('../models/videoModel');
const Program = require('../models/Program');
const { isLoggedIn, isCoach, isNotCoach, isNotProgramAuthor, isProgramAuthor } = require('../middleware');
const User = require('../models/User');
const router=express.Router();

const PROGRAM_PLACEHOLDER =
  "https://via.placeholder.com/400x300?text=No+Image";

function getFirstScheduleVideoId(schedule = []) {
  for (const day of schedule) {
    if (Array.isArray(day) && day.length > 0) {
      const entry = day[0];
      if (entry && typeof entry === "object" && entry._id) return entry._id;
      return entry;
    }
  }
  return null;
}

async function getCoverUrlFromSchedule(schedule = []) {
  const videoId = getFirstScheduleVideoId(schedule);
  if (!videoId) return null;
  const video = await FitnessVideo.findById(videoId).select("imgFileUrl").lean();
  return video?.imgFileUrl || null;
}

async function withProgramCoverImages(programs) {
  const list = programs.map((program) =>
    program.toObject ? program.toObject() : { ...program }
  );

  const videoIds = [
    ...new Set(
      list
        .map((program) => getFirstScheduleVideoId(program.schedule))
        .filter(Boolean)
        .map(String)
    ),
  ];

  const videos = videoIds.length
    ? await FitnessVideo.find({ _id: { $in: videoIds } }).select("imgFileUrl").lean()
    : [];
  const videoMap = Object.fromEntries(
    videos.map((video) => [String(video._id), video.imgFileUrl])
  );

  return list.map((program) => {
    const firstVideoId = getFirstScheduleVideoId(program.schedule);
    const scheduleImage = firstVideoId
      ? videoMap[String(firstVideoId)]
      : null;
    return {
      ...program,
      file: scheduleImage || program.file || PROGRAM_PLACEHOLDER,
    };
  });
}


router.post('/addprogram',isLoggedIn, isCoach, async(req,res)=>{
    
    try{
        let {name,tags, numberOfDays, schedule, equipment, typeOfProgram, description, timePerDay }=req.body;
        tags=tags.split(",");
        let coachId=req.user._id;

        const tagsArr = (tags).map(t => t.trim()).filter(Boolean);
        const numDays = Math.max(0, Number(numberOfDays) || 0);
        if (numDays < 1) return res.status(400).json({ msg: "numberOfDays must be >= 1" });

        const scheduleArr = Array.isArray(schedule) ? schedule : [];
        let fitnessVideos = await FitnessVideo.find({ coach: coachId });

        let arr = [];
        flag = true;
        for (let i = 0; i < numDays; i++) {
          arr.push([]);
          const day = scheduleArr[i] || [];
          for (let j = 0; j < fitnessVideos.length; j++) {
            const val = day[j];
            
            if (val === true || val === 'true' || val === 'on' || val === 1 || val === '1') {
              arr[i].push(fitnessVideos[j]._id);
              if (flag && fitnessVideos[j].imgFileUrl ){
                fileUrl = fitnessVideos[j].imgFileUrl;
                flag = false;
              }
            }
          }
        }
        await Program.create({ coach: coachId, tags: tagsArr, name, numberOfDays: numDays, schedule: arr, equipment, typeOfProgram, description, timePerDay, file: fileUrl || PROGRAM_PLACEHOLDER });

        res.status(201).json({msg: "Gotcha"} );
    }catch(e){
        console.error(e);
        res.status(400).json({msg: "Something went wrong..." });
    }
})

router.get('/allprograms' , async(req,res)=>{
    try{
        let programs=await Program.find({}).populate('coach').populate('reviews.user');
        const data = await withProgramCoverImages(programs);
        res.status(201).json({msg: "Gotcha",data});

    }catch(e){
        res.status(400).json({msg: "Something went wrong..." });
    }
})
router.get('/allprograms/:tag' , async(req,res)=>{
    try{
        let tag = req.params.tag;
        let programs = await Program.find({ tags: tag }).populate('coach').populate('reviews.user');
        const data = await withProgramCoverImages(programs);
        res.status(200).json({msg: "Gotcha",data});
    }catch(e){
        res.status(400).json({msg: "Something went wrong..." });

    }
})

router.get('/showprogram/:id' , async(req,res)=>{
    try{
        let id=req.params.id;
        let program=await Program.findById(id).populate('coach').populate('reviews.user').lean();
        
        // Populate schedule with video objects from FitnessVideo schema
        let sch=program.schedule;
        let vids = await Promise.all(
            sch.map(day => 
                Promise.all(
                    day.map(videoId => FitnessVideo.findById(videoId).lean())
                )
            )
        );
        
        // Replace schedule in program with actual video objects
        program.schedule = vids;
        
        let data={};
        data.program=program;
        data.vids=vids;
        res.status(201).json({msg: "Gotcha",data:data});
    }catch(e){
        console.error(e);
        res.status(400).json({msg: "Something went wrong..." });
    }
})

router.patch('/editprogram' , isLoggedIn, isCoach, isProgramAuthor , async(req,res)=>{
    try{
        let {id, name, numberOfDays, schedule, equipment, typeOfProgram, description, timePerDay, tags }=req.body;
        let coachId=req.user._id;
        
        let fitnessVideos=await FitnessVideo.find({ coach: coachId });
        // ensure numberOfDays is a Number and schedule is an array
        const numDays = Number(numberOfDays) || 0;
        if (numDays < 1) return res.status(400).json({ msg: "numberOfDays must be >= 1" });

        const scheduleArr = Array.isArray(schedule) ? schedule : [];
        let arr=[];
        for(let i=0;i<numDays;i++){
            arr.push([]);
            const day = scheduleArr[i] || [];
            for(let j=0;j<fitnessVideos.length;j++){
                const val = day[j];
                const isChecked = val === true || val === 'true' || val === 'on' || val === 1 || val === '1';
                if(isChecked){
                    arr[i].push(fitnessVideos[j]._id);
                }
            }
        }
        const update = {name, numberOfDays: numDays, schedule: arr, equipment, typeOfProgram, description, timePerDay};
        const coverUrl = await getCoverUrlFromSchedule(arr);
        if (coverUrl) {
          update.file = coverUrl;
        }
        if (tags !== undefined) {
          update.tags = typeof tags === 'string'
            ? tags.split(',').map((t) => t.trim()).filter(Boolean)
            : Array.isArray(tags) ? tags : [];
        }
        await Program.findByIdAndUpdate(id, update);
        res.status(201).json({msg: "Gotcha"} );
    }catch(e){
        console.error(e);
        res.status(400).json({msg: "Something went wrong..." });
    }
})

router.post('/deleteprogram/:id',isLoggedIn, isCoach, isProgramAuthor ,async (req,res)=>{
    try {
        let id=req.params.id;
        
        let response=await Program.findByIdAndDelete(id);
        res.status(201).json({msg: "Gotcha" });
    } catch (e) {
        res.status(400).json({msg: "Something went wrong..." });
    }
})

router.post('/changeprogramlike', isLoggedIn, async(req,res)=>{
    
    // try{
        let {program, vids}=req.body;
        let user=req.user;
        let flag=false;
        for(let i=0;i<user.likedPrograms.length;i++){
            if(user.likedPrograms[i].toString()==program._id.toString()){
                flag=true;
                break;
            }
        }
        let arr=[];
        if(flag){
            for(let i=0;i<user.likedPrograms.length;i++){
                if(user.likedPrograms[i].toString()!=program._id.toString()){
                    arr.push(user.likedPrograms[i]);
                }
            }
        }else{
            arr=[...user.likedPrograms];
            arr.push(program._id);
        }
        let result=await User.updateOne({_id: user._id}, {likedPrograms: arr});
       res.status(201).json({msg: "Gotcha" } );
    //   }catch(e){
    //       res.status(400).json({msg: "Something went wrong..." });
    //   }
})

router.get('/getlikedprograms',isLoggedIn, async(req,res)=>{
    
    try {
        let user=req.user;
        let result=await User.findById(user._id).populate('likedPrograms').exec();

        res.status(201).json({msg: "Gotcha" ,  data:result} );
    } catch (e) {
        res.status(400).json({msg: "Something went wrong..."});
    }
})

router.get('/getmyprograms',isLoggedIn, async(req,res)=>{    
    try {
        let user=req.user;
        let result=await Program.find({coach:user._id});
        const data = await withProgramCoverImages(result);

        res.status(201).json({msg: "Gotcha" ,  data} );
    } catch (e) {
        res.status(400).json({msg: "Something went wrong..."});
    }
})
router.patch("/program/addrating/:id", isLoggedIn, isNotProgramAuthor, isNotCoach, async (req, res) => {
  try {
    const userId = req.user._id;
    const id = req.params.id;
    let { userRating, newRating, newRatingCount } = req.body;
   
    userRating = Number(userRating);
    newRating = Number(newRating);
    newRatingCount = Number(newRatingCount);
    console.log("Rating data accumlated");
    let found = await Program.findById(id);
    for (let i = 0; i < found.rating.length; i++) {
      if (found.rating[i].user.toString() === userId.toString()) {
        return res.status(400).json({ msg: "You have already rated this program" });
      }
    }
    const updated = await Program.findByIdAndUpdate(
      id,
      {
        $push: { rating: { userRating, user: userId } },
        currentRating: newRating,
        currentRatingCount: newRatingCount,
      },
      { new: true }
    );

    res.status(201).json({ msg: "Gotcha", data: updated });
  } catch(e) {
    console.error(e);
    res.status(400).json({ msg: "Something went wrong..." });
  }
});

router.post('/program/addreview/:id', isLoggedIn, isNotProgramAuthor, async (req, res) => {
    try {
        const userId = req.user._id;
        const id = req.params.id;

        let { review } = req.body;
        review = review.trim();
        console.log("Review received:", review);
        if (review.length === 0) {
            return res.status(400).json({ msg: "Review cannot be empty" });
        }
        let found = await Program.findById(id);
        found.reviews.push({ review, user: userId });
        await found.save();
        res.status(201).json({ msg: "Gotcha", data: found });
    } catch (e) {
        console.error(e);
        res.status(400).json({ msg: "Something went wrong..." });
    }
})





module.exports=router;