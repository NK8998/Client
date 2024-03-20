import { useSelector } from "react-redux";
import { usePlayerStyles } from "./player-styles";
import { usePlayerMouseMove } from "./player-mouse-interactions";
import { usePlayerDraggingLogic } from "./player-dragging-logic";
import { useRef } from "react";
import { toNormal, toTheatre } from "./gsap-animations";

export const useMiniPlayermode = () => {
  const miniPlayer = useSelector((state) => state.watch.miniPlayer);
  const theatreMode = useSelector((state) => state.watch.theatreMode);
  const layoutShiftRef = useRef();
  const [applyChapterStyles, calculateWidth] = usePlayerStyles();
  const [handleMouseMove, handleMouseOut] = usePlayerMouseMove();
  const [startDrag, stopDragging, handleClick, handleDrag, updateRedDot, resetDot, isDragging] = usePlayerDraggingLogic();

  const toggleMiniPlayer = () => {
    const videoRef = document.querySelector("#html5-player");
    const primaryRef = document.querySelector(".player-if");
    const miniplayerRef = document.querySelector(".mini-player-inner");
    const containerRef = document.querySelector(".player-outer");
    const expandedContainerRef = document.querySelector(".player-expanded-container");
    const controlsRef = document.querySelector(".player-inner-relative");
    if (!miniplayerRef) return;
    if (!miniPlayer) {
      if (layoutShiftRef.current) {
        clearTimeout(layoutShiftRef.current);
      }
      miniplayerRef.classList.remove("visible");

      if (Array.from(miniplayerRef.children).includes(containerRef)) {
        miniplayerRef.removeChild(containerRef);
        if (theatreMode) {
          primaryRef.classList.remove("has-content");
          expandedContainerRef.append(containerRef);
        } else {
          primaryRef.append(containerRef);
          expandedContainerRef.classList.remove("has-content");
        }
        containerRef.classList.remove("miniplayer");
        videoRef.classList.remove("miniplayer");
        // toggle regular

        handleMouseOut();
        controlsRef.classList.add("transition");
        layoutShiftRef.current = setTimeout(() => {
          calculateWidth();
          applyChapterStyles();
          updateRedDot("");
          controlsRef.classList.remove("transition");
          handleMouseMove();
        }, 50);
      }
    } else if (miniPlayer) {
      // toggle miniPlayer
      if (Array.from(primaryRef.children).includes(containerRef)) {
        primaryRef.removeChild(containerRef);
        miniplayerRef.append(containerRef);
        primaryRef.classList.add("has-content");
      } else if (Array.from(expandedContainerRef.children).includes(containerRef)) {
        expandedContainerRef.removeChild(containerRef);
        miniplayerRef.append(containerRef);
        expandedContainerRef.classList.add("has-content");
      }
      applyChapterStyles();
      updateRedDot("");
      miniplayerRef.classList.add("visible");

      containerRef.classList.add("miniplayer");
      videoRef.classList.add("miniplayer");
    }
  };

  return [toggleMiniPlayer];
};

export const useTheatreMode = () => {
  const [startDrag, stopDragging, handleClick, handleDrag, updateRedDot, resetDot, isDragging] = usePlayerDraggingLogic();
  const [applyChapterStyles, calculateWidth] = usePlayerStyles();
  const theatreMode = useSelector((state) => state.watch.theatreMode);
  const location = useSelector((state) => state.app.location);

  const toggleTheatre = () => {
    // console.log("toggletheatre ran");
    const videoRef = document.querySelector("#html5-player");
    const primaryRef = document.querySelector(".player-if");
    const miniplayerRef = document.querySelector(".mini-player-inner");
    const containerRef = document.querySelector(".player-outer");
    const expandedContainerRef = document.querySelector(".player-expanded-container");
    const controlsRef = document.querySelector(".player-inner-relative");

    const isWatchpage = location.includes("watch") || window.location.pathname.includes("watch");
    if (!isWatchpage) return;
    if (!primaryRef || !containerRef) return;

    if (Array.from(primaryRef.children).includes(containerRef) && primaryRef && theatreMode) {
      primaryRef.classList.remove("has-content");
      if (Array.from(primaryRef.children).includes(containerRef)) {
        primaryRef.removeChild(containerRef);
        expandedContainerRef.append(containerRef);
        expandedContainerRef.classList.add("has-content");
      }
      videoRef.classList.remove("fullscreen");
      containerRef.classList.remove("fullscreen");
      videoRef.classList.add("theatre");
      containerRef.classList.add("theatre");
      applyChapterStyles();
      calculateWidth();

      updateRedDot("");
      toTheatre();
    } else if (primaryRef && !Array.from(primaryRef.children).includes(containerRef) && !theatreMode) {
      if (Array.from(expandedContainerRef.children).includes(containerRef)) {
        expandedContainerRef.removeChild(containerRef);
        expandedContainerRef.classList.remove("has-content");
        const firstChild = primaryRef.firstChild;
        primaryRef.insertBefore(containerRef, firstChild);
        primaryRef.classList.add("has-content");
      }
      videoRef.classList.remove("theatre");
      containerRef.classList.remove("theatre");
      applyChapterStyles();
      calculateWidth();

      updateRedDot("");
      toNormal();
    }
  };

  return [toggleTheatre];
};

export const useFullscreenMode = () => {
  const [startDrag, stopDragging, handleClick, handleDrag, updateRedDot, resetDot, isDragging] = usePlayerDraggingLogic();
  const [applyChapterStyles, calculateWidth] = usePlayerStyles();
  const theatreMode = useSelector((state) => state.watch.theatreMode);
  const location = useSelector((state) => state.app.location);
  const fullScreen = useSelector((state) => state.watch.fullScreen);

  const handleScrollPosition = (e) => {
    const root = document.querySelector("#root");
    const masthead = document.querySelector(".masthead-outer");
    if (root.scrollTop > 6) {
      masthead.classList.add("visible");
    } else {
      masthead.classList.remove("visible");
    }
  };

  const changeFullscreenStyles = () => {
    const videoRef = document.querySelector("#html5-player");
    const containerRef = document.querySelector(".player-outer");
    const masthead = document.querySelector(".masthead-outer");
    const root = document.querySelector("#root");
    const flexContent = document.querySelector(".flex-content");
    const guideWrapper = document.querySelector(".guide-wrapper");

    if (!guideWrapper || !flexContent || !root || !masthead || !containerRef) return;

    videoRef.classList.remove("fullscreen");
    containerRef.classList.remove("fullscreen");

    masthead.classList.remove("fullscreen");
    masthead.classList.remove("visible");
    flexContent.classList.remove("fullscreen");
    root.classList.remove("fullscreen");
    guideWrapper.classList.remove("fullscreen");
    root.removeEventListener("scroll", handleScrollPosition);
  };
  const toggleFullScreen = () => {
    // console.log("togglefullscreen ran");

    const videoRef = document.querySelector("#html5-player");
    const primaryRef = document.querySelector(".player-if");
    const containerRef = document.querySelector(".player-outer");
    const expandedContainerRef = document.querySelector(".player-expanded-container");

    if (!primaryRef || !containerRef) return;
    const masthead = document.querySelector(".masthead-outer");
    const root = document.querySelector("#root");
    const flexContent = document.querySelector(".flex-content");
    const guideWrapper = document.querySelector(".guide-wrapper");

    if (!fullScreen && !location.includes("watch")) {
      changeFullscreenStyles();
      return;
    }

    if (primaryRef && fullScreen) {
      expandedContainerRef.classList.remove("has-content");

      if (Array.from(primaryRef.children).includes(containerRef)) {
        primaryRef.removeChild(containerRef);
        expandedContainerRef.append(containerRef);
      }
      primaryRef.classList.remove("has-content");

      videoRef.classList.add("fullscreen");
      containerRef.classList.add("fullscreen");
      applyChapterStyles();
      calculateWidth();

      updateRedDot("");
      root.classList.add("fullscreen");
      flexContent.classList.add("fullscreen");
      masthead.classList.add("fullscreen");
      guideWrapper.classList.add("fullscreen");

      root.addEventListener("scroll", handleScrollPosition);
    } else if (primaryRef && !Array.from(primaryRef.children).includes(containerRef) && !fullScreen) {
      // console.log("exiting fullscreen");
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
      containerRef.classList.remove("fullscreen");
      if (Array.from(expandedContainerRef.children).includes(containerRef) && !theatreMode) {
        expandedContainerRef.removeChild(containerRef);
        expandedContainerRef.classList.remove("has-content");
        const firstChild = primaryRef.firstChild;
        primaryRef.insertBefore(containerRef, firstChild);
        videoRef.classList.remove("theatre");
        containerRef.classList.remove("theatre");
        primaryRef.classList.add("has-content");
      }
      if (theatreMode) {
        primaryRef.classList.remove("has-content");
        videoRef.classList.add("theatre");
        containerRef.classList.add("theatre");
        toTheatre();
      }
      changeFullscreenStyles();
      applyChapterStyles();
      calculateWidth();

      updateRedDot("");
    }
  };

  return [toggleFullScreen];
};