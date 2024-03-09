import { useRef } from "react";

export function usePlayerMouseMove() {
  const timeoutRef = useRef();

  const handleMouseMove = (playerRef) => {
    if (!playerRef.current) return;
    handleHover(playerRef);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      handleMouseOut(playerRef);
    }, 3000);
  };

  const handleHover = (playerRef) => {
    const controlsRef = document.querySelector(".player-inner-relative");
    if (!controlsRef || !playerRef.current) return;
    controlsRef.classList.remove("hide");
    const tracks = playerRef.current.getTextTracks();
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      handleMouseOut(playerRef);
    }, 3000);
  };

  const handleMouseOut = (playerRef) => {
    const controlsRef = document.querySelector(".player-inner-relative");
    const videoRef = document.querySelector("#html5-player");

    if (!videoRef || !controlsRef || !playerRef.current) return;
    if (videoRef.paused) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    controlsRef.classList.add("hide");
    const tracks = playerRef.current.getTextTracks();
  };

  return [handleMouseMove, handleHover, handleMouseOut];
}
