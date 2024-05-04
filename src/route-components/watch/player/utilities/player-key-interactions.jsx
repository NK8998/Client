import { useDispatch, useSelector } from "react-redux";
import { handleFullscreen, handleTheatre, toggleTheatreMode, updateIsTransitioning } from "../../../../store/Slices/watch-slice";
import { useRef } from "react";
import { seekVideo, usePlayerProgressBarLogic } from "./player-progressBar-logic";
import { usePlayerMouseMove } from "./player-mouse-interactions";
import { toPause, toPlay } from "./gsap-animations";
import { usePlayerBufferingState, usePlayerDraggingLogic } from "./player-dragging-logic";

export const usePlayerkeyInteractions = () => {
  const dispatch = useDispatch();
  const theatreTimeOut = useRef();
  const fullScreenTimeout = useRef();
  const theatreMode = useSelector((state) => state.watch.theatreMode);
  const fullScreen = useSelector((state) => state.watch.fullScreen);
  const timeoutRef2 = useRef();
  const isHolding = useRef(false);
  const location = useSelector((state) => state.app.location);
  const focusViaKeyBoard = useRef(false);
  const keyDownTime = useRef();
  const [updateBufferBar, updateProgressBar] = usePlayerProgressBarLogic();
  const [handleDoubleClick, handlePlayState] = usePlayerClickInteractions();
  const [startDrag, stopDragging, handleClick, handleDrag, updateRedDot, resetDot, isDragging] = usePlayerDraggingLogic();
  const [checkBufferedOnTrackChange, checkBuffered] = usePlayerBufferingState();

  const handleKeyPress = (e) => {
    const videoRef = document.querySelector("#html5-player");
    const isWatchpage = location.includes("watch") || window.location.pathname.includes("watch");
    if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT") return;
    // console.log(e.target);

    keyDownTime.current = Date.now();
    let wasPlaying = !videoRef.paused;

    const key = e.key.toLowerCase();
    const currentTime = videoRef.currentTime;
    const duration = videoRef.duration;
    const timeStep = 5;

    const handlePlayingState = () => {
      if (wasPlaying) {
        videoRef.play();
      }
      updateProgressBar();
      checkBuffered();
      updateRedDot("");
    };
    if (key === "arrowleft" && currentTime > 0) {
      seekVideo(currentTime - timeStep, videoRef);
      handlePlayingState();
    } else if (key === "arrowright" && currentTime < duration) {
      seekVideo(currentTime + timeStep, videoRef);
      handlePlayingState();
    } else if (key === "t") {
      if (!isWatchpage) return;
      if (theatreTimeOut.current) {
        clearTimeout(theatreTimeOut.current);
      }

      theatreTimeOut.current = setTimeout(() => {
        dispatch(handleTheatre(theatreMode));
      }, 130);
    } else if (key === " ") {
      e.preventDefault();

      if (timeoutRef2.current) {
        return;
      }
      timeoutRef2.current = setTimeout(() => {
        videoRef.playbackRate = 2;
        isHolding.current = true;
      }, 250);
    } else if (key === "f") {
      if (!isWatchpage) return;
      if (fullScreenTimeout.current) {
        clearTimeout(fullScreenTimeout.current);
      }
      fullScreenTimeout.current = setTimeout(() => {
        dispatch(handleFullscreen(fullScreen));
      }, 100);
    }
  };

  const handleKeyUp = (e) => {
    const videoRef = document.querySelector("#html5-player");
    focusViaKeyBoard.current = true;
    const isWatchpage = location.includes("watch") || window.location.pathname.includes("watch");
    const key = e.key.toLowerCase();

    if (key === " ") {
      !isHolding.current && handlePlayState();
      videoRef.playbackRate = 1;
      clearTimeout(timeoutRef2.current);
      timeoutRef2.current = null;
      isHolding.current = false;
    }
  };

  return [handleKeyPress, handleKeyUp, focusViaKeyBoard];
};

export const usePlayerClickInteractions = () => {
  const timeoutClick = useRef();
  const fullScreen = useSelector((state) => state.watch.fullScreen);
  const dispatch = useDispatch();
  const [handleMouseMove, handleHover, handleMouseOut] = usePlayerMouseMove();

  const handleDoubleClick = () => {
    if (timeoutClick.current) {
      clearTimeout(timeoutClick.current);
    }

    dispatch(handleFullscreen(fullScreen));
  };
  const handlePlayState = () => {
    const videoRef = document.querySelector("#html5-player");
    if (timeoutClick.current) {
      clearTimeout(timeoutClick.current);
    }
    timeoutClick.current = setTimeout(() => {
      if (videoRef.paused) {
        videoRef.play();
      } else {
        handleMouseMove();
        videoRef.pause();
      }
    }, 200);
  };

  return [handleDoubleClick, handlePlayState];
};
