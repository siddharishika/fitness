import React, { useEffect, useRef, useState } from "react";
import getVideoPlaybackUrl from "./getVideoPlaybackUrl";

function VideoPlayer({ url }) {
  const playerRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const videoUrl = getVideoPlaybackUrl(url);

  useEffect(() => {
    setLoaded(false);
    setHasError(false);
  }, [videoUrl]);

  useEffect(() => {
    const player = playerRef.current;
    if (loaded && player) {
      player.play().catch((error) => {
        if (error.name !== "AbortError") {
        }
      });
    }
  }, [loaded, videoUrl]);

  if (!videoUrl) {
    return (
      <div
        style={{
          width: "100%",
          minHeight: "240px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#161823",
          color: "#A7C7E7",
        }}
      >
        Loading video…
      </div>
    );
  }

  if (hasError) {
    return (
      <div
        style={{
          width: "100%",
          minHeight: "240px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#161823",
          color: "#A7C7E7",
          padding: "16px",
          textAlign: "center",
        }}
      >
        Unable to load this video. The file may be missing or unavailable.
      </div>
    );
  }

  return (
    <video
      key={videoUrl}
      ref={playerRef}
      src={videoUrl}
      controls
      muted
      playsInline
      preload="metadata"
      style={{ width: "100%", display: "block" }}
      onLoadedData={() => setLoaded(true)}
      onError={() => setHasError(true)}
    />
  );
}

export default VideoPlayer;
