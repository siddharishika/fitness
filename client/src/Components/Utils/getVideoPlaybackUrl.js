export default function getVideoPlaybackUrl(url) {
  const trimmed = typeof url === "string" ? url.trim() : "";
  if (!trimmed || !trimmed.includes("ik.imagekit.io")) {
    return trimmed;
  }

  const path = trimmed.split("?")[0];
  if (/\/[^/]*_t_[^/]+$/.test(path)) {
    return `${path}/ik-video.mp4`;
  }

  return trimmed;
}
