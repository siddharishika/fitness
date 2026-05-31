const mongoose = require("mongoose");
const User = require("../models/User");
const FitnessVideo = require("../models/videoModel");
const Program = require("../models/Program");
const Recipe = require("../models/Recipe");
const {
  deleteImageKitFiles,
  deleteImageKitFileByUrl,
} = require("./imageKitCleanup");

async function removeVideosFromAllProgramSchedules(videoIds) {
  if (!videoIds.length) return;

  const idSet = new Set(videoIds.map(String));
  const programs = await Program.find({}).select("schedule");

  await Promise.all(
    programs.map(async (program) => {
      const nextSchedule = program.schedule.map((day) =>
        day.filter((videoId) => !idSet.has(String(videoId)))
      );
      const changed =
        JSON.stringify(nextSchedule) !== JSON.stringify(program.schedule);
      if (changed) {
        program.schedule = nextSchedule;
        await program.save();
      }
    })
  );
}

async function deleteUserAccount(userId) {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const [videos, programs, recipes, user] = await Promise.all([
    FitnessVideo.find({ coach: userObjectId })
      .select("_id fileId imgFileId")
      .lean(),
    Program.find({ coach: userObjectId }).select("_id").lean(),
    Recipe.find({ user: userObjectId }).select("photo").lean(),
    User.findById(userObjectId).select("fileId").lean(),
  ]);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const videoIds = videos.map((video) => video._id);
  const programIds = programs.map((program) => program._id);
  const recipeIds = recipes.map((recipe) => recipe._id);

  const videoFileIds = videos.flatMap((video) =>
    [video.fileId, video.imgFileId].filter(Boolean)
  );

  await deleteImageKitFiles({
    fileIds: [...videoFileIds, user.fileId].filter(Boolean),
  });

  await Promise.all(
    recipes
      .map((recipe) => recipe.photo)
      .filter(Boolean)
      .map((photoUrl) => deleteImageKitFileByUrl(photoUrl))
  );

  const pullUserEngagement = {
    reviews: { user: userObjectId },
    rating: { user: userObjectId },
  };

  await Promise.all([
    FitnessVideo.updateMany({}, { $pull: pullUserEngagement }),
    Program.updateMany({}, { $pull: pullUserEngagement }),
    Recipe.updateMany({}, { $pull: pullUserEngagement }),
  ]);

  const cleanupTasks = [];

  if (videoIds.length) {
    cleanupTasks.push(
      User.updateMany({}, { $pull: { likedVideos: { $in: videoIds } } })
    );
    cleanupTasks.push(removeVideosFromAllProgramSchedules(videoIds));
  }

  if (programIds.length) {
    cleanupTasks.push(
      User.updateMany({}, { $pull: { likedPrograms: { $in: programIds } } }),
      User.updateMany(
        { currentProgram: { $in: programIds } },
        { $unset: { currentProgram: "", currentCompleteSchedule: "" } }
      )
    );
  }

  if (recipeIds.length) {
    cleanupTasks.push(
      User.updateMany({}, { $pull: { likedRecipes: { $in: recipeIds } } })
    );
  }

  await Promise.all(cleanupTasks);

  await Promise.all([
    Program.deleteMany({ coach: userObjectId }),
    FitnessVideo.deleteMany({ coach: userObjectId }),
    Recipe.deleteMany({ user: userObjectId }),
  ]);

  await User.findByIdAndDelete(userObjectId);
}

module.exports = { deleteUserAccount };
