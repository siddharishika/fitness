const PROGRAM_PLACEHOLDER = "https://via.placeholder.com/400x300?text=No+Image";

function getFirstScheduleVideo(schedule = []) {
  for (const day of schedule) {
    if (Array.isArray(day) && day.length > 0) {
      return day[0];
    }
  }
  return null;
}

export function getProgramImage(program) {
  if (!program) return PROGRAM_PLACEHOLDER;

  const firstVideo = getFirstScheduleVideo(program.schedule);
  if (firstVideo && typeof firstVideo === "object" && firstVideo.imgFileUrl) {
    return firstVideo.imgFileUrl;
  }

  if (program.file) {
    return program.file;
  }

  return PROGRAM_PLACEHOLDER;
}

export { PROGRAM_PLACEHOLDER };
