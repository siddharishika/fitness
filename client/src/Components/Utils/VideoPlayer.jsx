import React, { useEffect, useRef, useState } from "react";

function VideoPlayer({ url }) {
  const playerRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  console.log("Video URL: ", url);

  useEffect(() => {
    setLoaded(false); // Reset loaded state on URL change
  }, [url]);

  useEffect(() => {
    const player = playerRef.current;
    if (loaded && player) {
      player.play().catch((error) => {
        if (error.name !== "AbortError") {
          console.error(error);
        }
      });
    }
  }, [loaded, url]);

  return (
    <video
      ref={playerRef}
      src={url}
      controls
      muted
      onLoadedData={() => setLoaded(true)}
      onError={(e) => console.error("Video load error:", e)}
    />
  );
}

export default VideoPlayer;