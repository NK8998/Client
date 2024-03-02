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
    const controlsRef = document.querySelector(".player-inner-relative");
    if (!controlsRef) return;
    controlsRef.classList.remove("hide");

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      handleMouseOut();
    }, 3000);
  };

  const handleMouseOut = () => {
    const controlsRef = document.querySelector(".player-inner-relative");
    const videoRef = document.querySelector("#html5-player");

    if (!videoRef || !controlsRef) return;
    if (videoRef.paused) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    controlsRef.classList.add("hide");
  };

  return [handleMouseMove, handleHover, handleMouseOut];
}
