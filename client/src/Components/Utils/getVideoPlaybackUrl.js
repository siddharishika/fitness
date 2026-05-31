/**
 * ImageKit unique filenames can include `_t_`, which the CDN parses as a
 * named transformation and serves as an image request (400 for videos).
 * Appending `/ik-video.mp4` forces raw video delivery for those URLs.
 */
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
