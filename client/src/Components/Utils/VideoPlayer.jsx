import React, { useEffect, useRef } from "react";

function VideoPlayer({ url }) {
  const playerRef = useRef(null);
    console.log("Video URL: ", url);
  useEffect(() => {
    const player = playerRef.current;

    player.play().catch((error) => {
      if (error.name !== "AbortError") {
        console.error(error);
      }
    });

    return () => {
      // Pause or stop playback on unmount to avoid aborted play promise
      if (player) {
        player.pause();
        // Optionally remove the video element or reset src
        player.src = "";
      }
    };
  }, [url]);

  return <video ref={playerRef} src={url} controls />;
}
export default VideoPlayer;