import { useRef } from "react";

export function usePlayerMouseMove() {
  const timeoutRef = useRef();

  const handleMouseMove = () => {
    handleHover();
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      handleMouseOut();
    }, 3000);
  };

  const handleHover = () => {
    const videoContainer = document.querySelector(".captions-container-relative");
    const controlsRef = document.querySelector(".player-inner-relative");
    if (!controlsRef || !videoContainer) return;
    controlsRef.classList.remove("hide");
    videoContainer.classList.remove("hide");
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      handleMouseOut();
    }, 3000);
  };

  const handleMouseOut = () => {
    const videoContainer = document.querySelector(".captions-container-relative");

    const controlsRef = document.querySelector(".player-inner-relative");
    const videoRef = document.querySelector("#html5-player");

    if (!videoRef || !controlsRef || !videoContainer) return;
    if (videoRef.paused) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    controlsRef.classList.add("hide");
    videoContainer.classList.add("hide");
  };

  return [handleMouseMove, handleHover, handleMouseOut];
}
