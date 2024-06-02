import { useDispatch, useSelector } from "react-redux";
import { handleFullscreen, handleTheatre, toggleTheatreMode, updateIsTransitioning } from "../../../../store/Slices/watch-slice";
import { useRef } from "react";
import { seekVideo, usePlayerProgressBarLogic } from "./player-progressBar-logic";
import { usePlayerMouseMove } from "./player-mouse-interactions";
import { toPause, toPlay } from "./gsap-animations";
import { usePlayerBufferingState, usePlayerDraggingLogic } from "./player-dragging-logic";
import { updateSeeking } from "../../../../store/Slices/player-slice";

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
  const newTime = useRef(0);
  const timeoutRef3 = useRef();
  const wasPlaying = useRef(false);

  const handleKeyPress = (e) => {
    const videoRef = document.querySelector("#html5-player");
    const isWatchpage = location.includes("watch") || window.location.pathname.includes("watch");
    if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT") return;
    keyDownTime.current = Date.now();

    const key = e.key.toLowerCase();
    const timeStep = 5;
    wasPlaying.current = !videoRef.paused;

    if (key === "arrowleft") {
      if (timeoutRef3.current) {
        clearTimeout(timeoutRef3.current);
      }

      newTime.current = newTime.current - timeStep;
    } else if (key === "arrowright") {
      if (timeoutRef3.current) {
        clearTimeout(timeoutRef3.current);
      }
      newTime.current = newTime.current + timeStep;
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
    }
  };

  const handleKeyUp = (e) => {
    const videoRef = document.querySelector("#html5-player");
    const isWatchpage = location.includes("watch") || window.location.pathname.includes("watch");
    const key = e.key.toLowerCase();
    const currentTime = videoRef.currentTime;

    if (key === "arrowleft" || key === "arrowright") {
      timeoutRef3.current = setTimeout(() => {
        dispatch(updateSeeking(true));
        seekVideo(newTime.current + currentTime);
        newTime.current = 0;
      }, 170);
    } else if (key === "tab") {
      focusViaKeyBoard.current = true;
    } else if (key === " ") {
      !isHolding.current && handlePlayState();
      videoRef.playbackRate = 1;
      clearTimeout(timeoutRef2.current);
      timeoutRef2.current = null;
      isHolding.current = false;
    } else if (key === "f") {
      if (!isWatchpage) return;
      dispatch(handleFullscreen(fullScreen));
    }
  };

  return [handleKeyPress, handleKeyUp, focusViaKeyBoard, wasPlaying];
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
    if (!window.location.pathname.includes("watch")) return;

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
