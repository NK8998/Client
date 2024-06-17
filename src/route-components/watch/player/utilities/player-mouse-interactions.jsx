import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { usePlayerProgressBarLogic } from "./player-progressBar-logic";
import { usePlayerDraggingLogic } from "./player-dragging-logic";

export function usePlayerMouseMove() {
  const settingsShowing = useSelector((state) => state.player.settingsShowing);
  const timeoutRef = useRef();
  const { updateProgressBar, updateBufferBar } = usePlayerProgressBarLogic();
  const { updateRedDot } = usePlayerDraggingLogic();

  useEffect(() => {
    if (settingsShowing) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  }, [settingsShowing]);

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
    if (controlsRef.classList.contains("hide")) {
      const playerContainer = document.querySelector(".player-outer");
      playerContainer.classList.add("seeking");
      requestAnimationFrame(() => {
        updateProgressBar();
        updateRedDot();
        updateBufferBar();
        playerContainer.classList.remove("seeking");
      });
    }
    const videoContainer = document.querySelector(".captions-container-relative");
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
    const style = getComputedStyle(document.documentElement);
    const hovering = style.getPropertyValue("--hovering").trim();

    if (hovering === "true") return;
    const videoContainer = document.querySelector(".captions-container-relative");

    const controlsRef = document.querySelector(".player-inner-relative");
    const videoRef = document.querySelector("#html5-player");

    if (!videoRef || !controlsRef || !videoContainer) return;
    if (videoRef.paused || settingsShowing === true) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    controlsRef.classList.add("hide");
    videoContainer.classList.add("hide");
  };

  return { handleMouseMove, handleHover, handleMouseOut };
}
