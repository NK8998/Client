import { useDispatch, useSelector } from "react-redux";
import { handleFullscreen, handleTheatre } from "../../../../store/Slices/watch-slice";
import { useRef } from "react";
import { seekVideo } from "./player-progressBar-logic";
import { usePlayerMouseMove } from "./player-mouse-interactions";
import { usePlayerBufferingState } from "./player-dragging-logic";
import { updatePlayerState } from "../../../../store/Slices/player-slice";

export const usePlayerkeyInteractions = () => {
  const dispatch = useDispatch();
  const theatreTimeOut = useRef();
  const theatreMode = useSelector((state) => state.watch.theatreMode);
  const fullScreen = useSelector((state) => state.watch.fullScreen);
  const playbackRate = useSelector((state) => state.player.playbackRate);
  const timeoutRef2 = useRef();
  const isHolding = useRef(false);
  const location = useSelector((state) => state.app.location);
  const focusViaKeyBoard = useRef(false);
  const keyDownTime = useRef();
  const [checkBufferedOnTrackChange, checkBuffered] = usePlayerBufferingState();
  const wasPlaying = useRef(false);

  const handleKeyPress = (e) => {
    const videoRef = document.querySelector("#html5-player");
    const isWatchpage = location.includes("watch") || window.location.pathname.includes("watch");
    if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT") return;
    keyDownTime.current = Date.now();

    const key = e.key.toLowerCase();
    const timeStep = 5;
    wasPlaying.current = !videoRef.paused;
    const currentTime = videoRef.currentTime;

    if (key === "arrowleft") {
      dispatch(updatePlayerState({ playerPropertyToUpdate: "seeking", updatedValue: true }));
      seekVideo(currentTime - timeStep);
      checkBuffered();
    } else if (key === "arrowright") {
      dispatch(updatePlayerState({ playerPropertyToUpdate: "seeking", updatedValue: true }));
      seekVideo(currentTime + timeStep);
      checkBuffered();
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
        videoRef.play();
        videoRef.playbackRate = 2;
        isHolding.current = true;
      }, 250);
    }
  };

  const handleKeyUp = (e) => {
    const videoRef = document.querySelector("#html5-player");
    const isWatchpage = location.includes("watch") || window.location.pathname.includes("watch");
    const key = e.key.toLowerCase();
    if (key === "tab") {
      focusViaKeyBoard.current = true;
    } else if (key === " ") {
      videoRef.playbackRate = playbackRate;
      clearTimeout(timeoutRef2.current);
      timeoutRef2.current = null;
      if (isHolding.current === true) {
        isHolding.current = false;
        return;
      }
      if (videoRef.paused) {
        videoRef.play();
      } else {
        videoRef.pause();
      }
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
