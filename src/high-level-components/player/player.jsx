import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import shaka from "shaka-player";
import "./player.css";
import BottomControls from "./player-components/bottom-controls/bottom-controls";
import Chapters from "./player-components/chapters/chapters";
import generateChapters from "./player-components/chapters/chaptersGen";
import { toNormal, toPause, toPlay, toTheatre } from "./utilities/gsap-animations";
import { handleFullscreen, handleTheatre } from "../../store/Slices/watch-slice";
import { seekVideo } from "./utilities/player-progressBar-logic";

export default function Player({ videoRef, secondaryRef, containerRef, expandedContainerRef, primaryRef }) {
  const dispatch = useDispatch();
  const location = useSelector((state) => state.app.location);
  const playingVideo = useSelector((state) => state.watch.playingVideo);
  const theatreMode = useSelector((state) => state.watch.theatreMode);
  const fullScreen = useSelector((state) => state.watch.fullScreen);
  const { descriptionString, duration, videoId, url } = playingVideo;
  const attempts = useRef(0);
  const [chapters, setChapters] = useState([{ start: 0, title: "", end: 50 }]);

  const [play, setPlay] = useState(false);
  const playerRef = useRef();
  const redDotRef = useRef();
  const redDotWrapperRef = useRef();
  const chapterContainerRef = useRef();
  const innerChapterContainerRef = useRef();
  const timeoutRef = useRef();
  const timeIntervalRef = useRef();
  const spinnerRef = useRef();
  const controlsRef = useRef();
  const theatreTimeOut = useRef();
  const keyDownTime = useRef();
  const timeoutRef2 = useRef();
  const isHolding = useRef(false);
  const intervalRef = useRef();
  const currentTimeTracker = useRef(0);
  const mouseDownTracker = useRef();
  const isDragging = useRef(false);
  const fullScreenTimeout = useRef();
  const focusViaKeyBoard = useRef(false);

  useLayoutEffect(() => {
    const generatedChapters = generateChapters(descriptionString, duration);

    setChapters(generatedChapters);
  }, [playingVideo]);

  useLayoutEffect(() => {
    const isWatchpage = location.includes("watch") || window.location.pathname.includes("watch");

    if (isWatchpage) {
      applyChapterStyles();
    }
  }, [chapters, location]);

  useLayoutEffect(() => {
    const isWatchpage = location.includes("watch") || window.location.pathname.includes("watch");
    if (isWatchpage === false) {
      window.removeEventListener("resize", calculateWidth);
    } else if (isWatchpage === true) {
      window.addEventListener("resize", calculateWidth);
    }

    return () => {
      window.removeEventListener("resize", calculateWidth);
    };
  }, [location, videoId, theatreMode]);

  useLayoutEffect(() => {
    const isWatchpage = location.includes("watch") || window.location.pathname.includes("watch");
    if (isWatchpage === false) {
      videoRef.current.pause();
      clearIntervalProgress();
      detachPlayer();
      window.removeEventListener("resize", calculateWidth);
    } else if (isWatchpage === true) {
      attatchPlayer();
      calculateWidth();
      applyChapterStyles();
    }
  }, [location, videoId, playingVideo]);

  useLayoutEffect(() => {
    const handleKeyPress = (e) => {
      const isWatchpage = location.includes("watch") || window.location.pathname.includes("watch");
      if (!isWatchpage) return;
      if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT") return;
      // console.log(e.target);

      keyDownTime.current = Date.now();
      let wasPlaying = !videoRef.current.paused;

      const key = e.key.toLowerCase();
      const currentTime = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      const timeStep = 5;

      const handlePlayingState = () => {
        if (wasPlaying) {
          videoRef.current.play();
        }
        updateBufferBar();
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
        if (theatreTimeOut.current) {
          clearTimeout(theatreTimeOut.current);
        }
        theatreTimeOut.current = setTimeout(() => {
          dispatch(handleTheatre(theatreMode));
        }, 400);
      } else if (key === " ") {
        e.preventDefault();

        if (timeoutRef2.current) {
          return;
        }
        timeoutRef2.current = setTimeout(() => {
          videoRef.current.playbackRate = 2;
          isHolding.current = true;
        }, 250);
      } else if (key === "f") {
        if (fullScreenTimeout.current) {
          clearTimeout(fullScreenTimeout.current);
        }
        fullScreenTimeout.current = setTimeout(() => {
          dispatch(handleFullscreen(fullScreen));
        }, 400);
      }
    };

    const handleKeyUp = (e) => {
      const isWatchpage = location.includes("watch") || window.location.pathname.includes("watch");
      if (!isWatchpage) return;
      const key = e.key.toLowerCase();

      if (key === " ") {
        !isHolding.current && handlePlayState();
        videoRef.current.playbackRate = 1;
        clearTimeout(timeoutRef2.current);
        timeoutRef2.current = null;
        isHolding.current = false;
      } else if (key === "tab" && e.target.classList.contains("chapters-container")) {
        focusViaKeyBoard.current = true;
        innerChapterContainerRef.current.classList.add("focused");
      } else if (key !== "tab" && !e.target.classList.contains("chapters-container")) {
        focusViaKeyBoard.current = false;
        innerChapterContainerRef.current.classList.remove("focused");
      }
    };

    handleHover();
    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [play, theatreMode, fullScreen, location]);

  useLayoutEffect(() => {
    const isWatchpage = location.includes("watch") || window.location.pathname.includes("watch");
    if (isWatchpage) {
      window.addEventListener("resize", updateStyles);
    } else if (!isWatchpage) {
      window.removeEventListener("resize", updateStyles);
    }

    return () => {
      window.removeEventListener("resize", updateStyles);
    };
  }, [location, videoId, theatreMode, chapters]);

  useLayoutEffect(() => {
    toggleTheatre();
  }, [theatreMode, chapters]);

  useLayoutEffect(() => {
    toggleFullScreen();

    return () => {
      const root = document.querySelector("#root");
      if (!root) return;
      root.removeEventListener("scroll", handleScrollPosition);
    };
  }, [fullScreen, theatreMode]);

  const updateStyles = () => {
    applyChapterStyles();
    updateRedDot("");
  };

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
    const masthead = document.querySelector(".masthead-outer");
    const root = document.querySelector("#root");
    const flexContent = document.querySelector(".flex-content");
    const guideWrapper = document.querySelector(".guide-wrapper");

    videoRef.current.classList.remove("fullscreen");
    containerRef.current.classList.remove("fullscreen");

    masthead.classList.remove("fullscreen");
    masthead.classList.remove("visible");
    flexContent.classList.remove("fullscreen");
    root.classList.remove("fullscreen");
    guideWrapper.classList.remove("fullscreen");
    root.removeEventListener("scroll", handleScrollPosition);
  };
  const toggleFullScreen = () => {
    if (!primaryRef.current || !containerRef.current) return;
    const masthead = document.querySelector(".masthead-outer");
    const root = document.querySelector("#root");
    const flexContent = document.querySelector(".flex-content");
    const guideWrapper = document.querySelector(".guide-wrapper");

    if (!fullScreen && !location.includes("watch")) {
      changeFullscreenStyles();
      return;
    }

    if (primaryRef.current && fullScreen) {
      if (Array.from(primaryRef.current.children).includes(containerRef.current)) {
        primaryRef.current.removeChild(containerRef.current);
        expandedContainerRef.current.append(containerRef.current);
      }

      videoRef.current.classList.add("fullscreen");
      containerRef.current.classList.add("fullscreen");
      applyChapterStyles();
      calculateWidth();

      updateRedDot("");
      root.classList.add("fullscreen");
      flexContent.classList.add("fullscreen");
      masthead.classList.add("fullscreen");
      guideWrapper.classList.add("fullscreen");

      root.addEventListener("scroll", handleScrollPosition);
    } else if (primaryRef.current && !Array.from(primaryRef.current.children).includes(containerRef.current) && !fullScreen) {
      // console.log("running");
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
      if (Array.from(expandedContainerRef.current.children).includes(containerRef.current) && !theatreMode) {
        expandedContainerRef.current.removeChild(containerRef.current);
        const firstChild = primaryRef.current.firstChild;
        primaryRef.current.insertBefore(containerRef.current, firstChild);
        videoRef.current.classList.remove("theatre");
        containerRef.current.classList.remove("theatre");
      }
      if (theatreMode) {
        videoRef.current.classList.add("theatre");
        containerRef.current.classList.add("theatre");
        toTheatre();
      }
      changeFullscreenStyles();
      applyChapterStyles();
      calculateWidth();

      updateRedDot("");
    }
  };

  const toggleTheatre = () => {
    const isWatchpage = location.includes("watch") || window.location.pathname.includes("watch");
    if (!isWatchpage) return;
    if (!primaryRef.current || !containerRef.current) return;

    if (Array.from(primaryRef.current.children).includes(containerRef.current) && primaryRef.current && theatreMode) {
      if (Array.from(primaryRef.current.children).includes(containerRef.current)) {
        primaryRef.current.removeChild(containerRef.current);
        expandedContainerRef.current.append(containerRef.current);
      }
      videoRef.current.classList.remove("fullscreen");
      containerRef.current.classList.remove("fullscreen");
      videoRef.current.classList.add("theatre");
      containerRef.current.classList.add("theatre");
      applyChapterStyles();
      calculateWidth();

      updateRedDot("");
      toTheatre();
    } else if (primaryRef.current && !Array.from(primaryRef.current.children).includes(containerRef.current) && !theatreMode) {
      if (Array.from(expandedContainerRef.current.children).includes(containerRef.current)) {
        expandedContainerRef.current.removeChild(containerRef.current);
        const firstChild = primaryRef.current.firstChild;
        primaryRef.current.insertBefore(containerRef.current, firstChild);
      }
      videoRef.current.classList.remove("theatre");
      containerRef.current.classList.remove("theatre");
      applyChapterStyles();
      calculateWidth();

      updateRedDot("");
      toNormal();
    }
  };

  useLayoutEffect(() => {
    checkBufferedOnTrackChange();
  }, [videoId, location]);

  useLayoutEffect(() => {
    clearIntervalProgress();
    resetBars();
    calculateWidth();
  }, [playingVideo, videoId]);

  const attatchPlayer = async () => {
    await detachPlayer();
    const manifestUri = url;
    if (manifestUri.length === 0 || !manifestUri.includes("http") || !videoRef.current) return;
    shaka.polyfill.installAll();
    if (shaka.Player.isBrowserSupported()) {
      playerRef.current = new shaka.Player();
      playerRef.current.attach(videoRef.current);

      playerRef.current.configure({
        manifest: {
          dash: {
            ignoreMinBufferTime: true,
          },
        },
        streaming: {
          bufferingGoal: 30,
          rebufferingGoal: 2,
        },
      });

      // Listen for error events
      playerRef.current.addEventListener("error", (event) => {
        console.error("Error code", event.detail.code);
      });

      playerRef.current.addEventListener("trackschanged", () => {
        console.log("Tracks have been loaded!");
        const tracksInfo = playerRef.current.getVariantTracks();
        const tracks = tracksInfo.map((track) => {
          return track.height;
        });
      });

      // Load the manifest
      playerRef.current
        .load(manifestUri)
        .then(() => {
          console.log("The video has been loaded!");
          handlePlayState();
        })
        .catch(onError);
    } else {
      console.error("Shaka Player is not supported on this browser.");
    }

    function onError(error) {
      console.error("Error code", error.code, "object", error);
      if (attempts.current > 2) return;
      attatchPlayer();
      attempts.current += 1;
    }
  };

  const resetBars = () => {
    // console.log("resetting");
    const scrubbingBarRefs = document.querySelectorAll(".scrubbing.bar");
    const bufferBarRefs = document.querySelectorAll(".buffer.bar");
    const progressBarRefs = document.querySelectorAll(".progress.bar");
    const arr = [{ ref: scrubbingBarRefs }, { ref: bufferBarRefs }, { ref: progressBarRefs }];
    arr.forEach((barRefs) => {
      barRefs.ref.forEach((barRef) => {
        barRef.style.width = `0%`;
      });
    });
  };

  const detachPlayer = async () => {
    if (playerRef.current) {
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
      }
      clearIntervalProgress();
      await playerRef.current.unload();
      playerRef.current = null;
    }
  };

  const calculateWidth = () => {
    // console.log("running");
    let secondaryRefWidth = 0;
    if (secondaryRef.current) {
      secondaryRefWidth = secondaryRef.current.clientWidth;
    }
    const windowWidth = window.innerWidth;
    const gaps = windowWidth >= 1041 ? 88 : 60;
    const maxVideoHeight = (73.5 * window.innerHeight) / 100;
    const remainingSpace = windowWidth - (gaps + secondaryRefWidth);
    // const aspectRatio = wideScreen ? 1920 / 1080 : 16 / 9;
    const aspectRatio = playingVideo.aspectRatio;

    let videoHeight = remainingSpace * aspectRatio > maxVideoHeight ? maxVideoHeight : remainingSpace * aspectRatio;
    let videoWidth = videoHeight * aspectRatio;

    // Check if the videoWidth is greater than the remainingSpace
    if (videoWidth > remainingSpace) {
      // Adjust the videoWidth and videoHeight to fit the remaining space
      videoWidth = remainingSpace;
      videoHeight = videoWidth * (1 / aspectRatio);
    }

    if (videoWidth >= 1280) {
      videoWidth = 1280;
      videoHeight = videoWidth * (1 / aspectRatio);
    }

    // console.log({ remainingSpace });
    // console.log({ videoHeight, videoWidth });
    document.documentElement.style.setProperty("--height", `${Math.round(videoHeight)}px`);
    document.documentElement.style.setProperty("--width", `${Math.round(videoWidth)}px`);
  };

  const updateBufferBar = () => {
    const buffered = videoRef.current.buffered;
    const currentTime = videoRef.current.currentTime;

    if (buffered.length > 0) {
      const bufferGroups = [];
      let currentGroup = [buffered.start(0), buffered.end(0)];

      for (let i = 0; i < buffered.length; i++) {
        const start = buffered.start(i);
        const end = buffered.end(i);
        // console.log({ start: start }, { end: end });

        if (start - currentGroup[1] <= 1) {
          currentGroup[1] = end;
        } else {
          bufferGroups.push(currentGroup);
          currentGroup = [start, end];
        }
      }
      bufferGroups.push(currentGroup);

      // Determine buffer range to use based on currentTime
      let bufferToUse;
      for (const group of bufferGroups) {
        if (currentTime >= group[0] && currentTime <= group[1]) {
          bufferToUse = group;
          break;
        }
      }
      if (!bufferToUse) return;
      const bufferBarRefs = document.querySelectorAll(".buffer.bar");

      bufferBarRefs.forEach((bufferBar) => {
        const index = bufferBar.getAttribute("dataIndex"); // get the data-index attribute
        const chapter = chapters[index]; // find the corresponding chapter

        if (chapter.start <= bufferToUse[1] && chapter.end >= bufferToUse[1]) {
          const chapterWidth = ((bufferToUse[1] - chapter.start) / (chapter.end - chapter.start)) * 100;
          bufferBar.style.width = `${chapterWidth}%`;
        } else if (chapter.end < bufferToUse[1]) {
          bufferBar.style.width = `100%`;
        } else {
          bufferBar.style.width = `0%`;
        }
      });
    }
  };

  const updateProgressBar = () => {
    const currentTime = videoRef.current.currentTime;

    const progressBarRefs = document.querySelectorAll(".progress.bar");

    progressBarRefs.forEach((progressBar) => {
      const curIndex = progressBar.getAttribute("dataIndex");
      const chapter = chapters[curIndex];
      if (chapter.start <= currentTime && chapter.end >= currentTime) {
        document.documentElement.style.setProperty("--currentChapterIndex", `${curIndex}`);
        const chapterWidth = ((currentTime - chapter.start) / (chapter.end - chapter.start)) * 100;
        progressBar.style.width = `${chapterWidth}%`;
      } else if (chapter.end < currentTime) {
        progressBar.style.width = `100%`;
      } else {
        progressBar.style.width = `0%`;
      }
    });

    const style = getComputedStyle(document.documentElement);
    const hovering = style.getPropertyValue("--hovering").trim();
    // console.log(hovering);

    if (hovering === "true" && chapters.length > 1) {
      const hoveringChapterIndex = style.getPropertyValue("--hoverChapterIndex").trim();
      const currentChapterIndex = style.getPropertyValue("--currentChapterIndex").trim();
      if (hoveringChapterIndex === currentChapterIndex) {
        redDotRef.current.style.scale = 1.5;
      } else {
        redDotRef.current.style.scale = 1;
      }
    }
  };
  const updateRedDot = (currentTimeTracker) => {
    if (chapters.length === 0) return;
    const endThreshold = Math.abs(videoRef.current.currentTime - chapters[chapters.length - 1].end);
    let currentTime;
    if (typeof currentTimeTracker === "number") {
      currentTime = currentTimeTracker;
    } else {
      currentTime = endThreshold <= 0.5 ? chapters[chapters.length - 1].end : videoRef.current.currentTime;
    }

    const progreeBarRefs = document.querySelectorAll(".progress.bar");
    if (currentTime >= chapters[0].start && currentTime <= chapters[chapters.length - 1].end) {
      progreeBarRefs.forEach((progressBar) => {
        const curIndex = progressBar.getAttribute("dataIndex");
        const chapter = chapters[curIndex];

        if (chapter.start <= currentTime && chapter.end >= currentTime) {
          const position = progressBar.getBoundingClientRect().right - innerChapterContainerRef.current.getBoundingClientRect().left;
          redDotWrapperRef.current.style.transform = `translateX(${position}px)`;
        }
      });
    } else if (currentTime < chapters[0].start) {
      const position = 0;
      redDotWrapperRef.current.style.transform = `translateX(${position}px)`;
    } else if (currentTime > chapters[chapters.length - 1].end) {
      const position = innerChapterContainerRef.current.clientWidth;
      redDotWrapperRef.current.style.transform = `translateX(${position}px)`;
    }
  };

  const updateScrubbingBar = (e) => {
    if (e.target.getAttribute("dataIndex")) {
      const hoveringIndex = e.target.getAttribute("dataIndex");
      document.documentElement.style.setProperty("--hoverChapterIndex", `${hoveringIndex}`);
    }

    document.documentElement.style.setProperty("--hovering", `true`);

    const style = getComputedStyle(document.documentElement);

    const hoveringChapterIndex = style.getPropertyValue("--hoverChapterIndex").trim();
    const currentChapterIndex = style.getPropertyValue("--currentChapterIndex").trim();
    if (hoveringChapterIndex === currentChapterIndex && chapters.length > 1) {
      redDotRef.current.style.scale = 1.5;
    } else {
      redDotRef.current.style.scale = 1;
    }

    const chaptersContainersRefs = document.querySelectorAll(".chapter-padding");
    const scrubbingBarRefs = document.querySelectorAll(".scrubbing.bar");

    chaptersContainersRefs.forEach((chapterContainer, index) => {
      const right = chapterContainer.getBoundingClientRect().right;
      const left = chapterContainer.getBoundingClientRect().left;

      if (left <= e.clientX && e.clientX <= right) {
        const chapterWidth = ((e.clientX - left) / (right - left)) * 100;
        scrubbingBarRefs[index].style.width = `${chapterWidth}%`;
        document.documentElement.style.setProperty("--hoverChapterIndex", `${index}`);
      } else if (right < e.clientX) {
        scrubbingBarRefs[index].style.width = `100%`;
      } else {
        scrubbingBarRefs[index].style.width = `0%`;
      }
    });
  };

  const handleClick = (e) => {
    checkBufferedOnTrackChange();
    const chaptersContainers = document.querySelectorAll(".chapter-padding");
    const progressBarRefs = document.querySelectorAll(".progress.bar");
    const style = getComputedStyle(document.documentElement);
    const currentIndex = parseInt(style.getPropertyValue("--hoverChapterIndex").trim());
    const chapterDuration = chapters[currentIndex].end - chapters[currentIndex].start;
    const currentChapterLeft = chaptersContainers[currentIndex].getBoundingClientRect().left;
    const currentChapterWidth = chaptersContainers[currentIndex].getBoundingClientRect().width;
    const position = e.clientX - currentChapterLeft;
    const ratio = position / currentChapterWidth;
    const timeOffset = ratio * chapterDuration;
    const currentTime = chapters[currentIndex].start + timeOffset;
    videoRef.current.currentTime = currentTime;

    redDotRef.current.style.scale = chapters.length === 1 ? 1 : 1.5;
    chapters.forEach((chapter, index) => {
      if (chapter.start <= currentTime && currentTime <= chapter.end) {
        const chapterWidth = ((currentTime - chapter.start) / (chapter.end - chapter.start)) * 100;
        progressBarRefs[index].style.width = `${chapterWidth}%`;
        const curIndex = progressBarRefs[index].getAttribute("dataIndex");
        document.documentElement.style.setProperty("--currentChapterIndex", `${curIndex}`);
        document.documentElement.style.setProperty("--hoverChapterIndex", `${curIndex}`);
        chaptersContainers[index].classList.add("drag-expand");
      } else if (chapter.end < currentTime) {
        progressBarRefs[index].style.width = `100%`;
        chaptersContainers[index].classList.remove("drag-expand");
      } else {
        progressBarRefs[index].style.width = `0%`;
        chaptersContainers[index].classList.remove("drag-expand");
      }
    });
    updateRedDot(currentTime);
  };

  const handleDrag = (e) => {
    checkBufferedOnTrackChange();
    const style = getComputedStyle(document.documentElement);
    const chaptersContainers = document.querySelectorAll(".chapter-padding");
    const progressBarRefs = document.querySelectorAll(".progress.bar");
    const currentIndex = parseInt(style.getPropertyValue("--hoverChapterIndex").trim());
    const chapterDuration = chapters[currentIndex].end - chapters[currentIndex].start;
    const currentChapterLeft = chaptersContainers[currentIndex].getBoundingClientRect().left;
    const currentChapterWidth = chaptersContainers[currentIndex].getBoundingClientRect().width;
    const position = e.clientX - currentChapterLeft;
    const ratio = position / currentChapterWidth;
    const timeOffset = ratio * chapterDuration;
    const currentTime = chapters[currentIndex].start + timeOffset;
    currentTimeTracker.current = currentTime;

    redDotRef.current.style.scale = chapters.length === 1 ? 1 : 1.5;

    chapters.forEach((chapter, index) => {
      if (chapter.start <= currentTime && currentTime <= chapter.end) {
        const chapterWidth = ((currentTime - chapter.start) / (chapter.end - chapter.start)) * 100;
        progressBarRefs[index].style.width = `${chapterWidth}%`;
        const curIndex = progressBarRefs[index].getAttribute("dataIndex");
        document.documentElement.style.setProperty("--currentChapterIndex", `${curIndex}`);
        document.documentElement.style.setProperty("--hoverChapterIndex", `${curIndex}`);

        chaptersContainers[index].classList.add("drag-expand");
      } else if (chapter.end < currentTime) {
        progressBarRefs[index].style.width = `100%`;
        chaptersContainers[index].classList.remove("drag-expand");
        // updateRedDot(currentTime);
      } else {
        progressBarRefs[index].style.width = `0%`;
        chaptersContainers[index].classList.remove("drag-expand");
        // updateRedDot(currentTime);
      }
    });
    updateRedDot(currentTime);
  };

  const handleSelect = (e) => {
    document.documentElement.style.setProperty("--select", "none");
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    return false;
  };

  const stopDragging = () => {
    document.documentElement.style.setProperty("--select", "");
    const style = getComputedStyle(document.documentElement);
    if (mouseDownTracker.current) {
      clearTimeout(mouseDownTracker.current);
    }
    isDragging.current === true && (videoRef.current.currentTime = currentTimeTracker.current);
    isDragging.current = false;
    if (play) {
      videoRef.current.play();
      toPlay();
    }
    videoRef.current.style.visibility = "visible";
    window.removeEventListener("mousemove", handleDrag);
    window.removeEventListener("mouseup", stopDragging);
    window.removeEventListener("selectstart", handleSelect);

    setTimeout(() => {
      const chaptersContainers = document.querySelectorAll(".chapter-padding");
      chaptersContainers.forEach((chaptersContainer, index) => {
        chaptersContainers[index].classList.remove("drag-expand");
      });
    }, 100);

    const hovering = style.getPropertyValue("--hovering").trim();
    if (hovering === "false") {
      resetDot();
    }
    chapterContainerRef.current.classList.remove("drag-expand");
  };

  const startDrag = () => {
    mouseDownTracker.current = setTimeout(() => {
      videoRef.current.pause();
      toPause();
      isDragging.current = true;
      videoRef.current.style.visibility = "hidden";
      chapterContainerRef.current.classList.add("drag-expand");
      window.addEventListener("mousemove", handleDrag);
      window.addEventListener("mouseup", stopDragging);
      window.addEventListener("selectstart", handleSelect);
    }, 130);
  };

  // const updateProgressAndBufferBars = (e) => {

  //     updateBufferBar(e);
  //     updateProgressBar(e);
  //     updateRedDot();

  // };

  const updateProgess = (e) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      // console.log("running");
      updateBufferBar();
      updateProgressBar();
      updateRedDot("");
    }, 60);
  };

  const clearIntervalProgress = () => {
    clearInterval(intervalRef.current);
  };

  const resetDot = () => {
    document.documentElement.style.setProperty("--hovering", `false`);
    redDotRef.current.style.scale = 0;
  };

  function applyChapterStyles() {
    const chaptersContainers = document.querySelectorAll(".chapter-padding");
    // console.log("running");
    let totalWidth = 0;
    const chapterContainerRefWidth = chapterContainerRef.current.clientWidth - 28;
    if (chapters.length === 0) return;
    chaptersContainers.forEach((chaptersContainer, index) => {
      const calculatedPercentage = ((chapters[index].end - chapters[index].start) / chapters[chapters.length - 1].end) * 100;
      let width = Math.trunc((calculatedPercentage / 100) * chapterContainerRefWidth);
      totalWidth += width;
      if (index === chapters.length - 1) {
        // Adjust the width of the last chapter block to fill the remaining space
        width += chapterContainerRefWidth - totalWidth;
      } else {
        width -= 2;
      }
      chaptersContainer.style.width = `${width}px`;
    });
  }

  const handlePlayState = () => {
    handleDoubleClick();
    if (timeIntervalRef.current) {
      clearInterval(timeIntervalRef.current);
    }
    if (videoRef.current.paused) {
      videoRef.current.play();
      toPlay();
    } else {
      videoRef.current.pause();
      toPause();
    }
  };

  const handleBufferBarOnTrackChange = () => {
    const bufferBarRefs = document.querySelectorAll(".buffer.bar");
    bufferBarRefs.forEach((bufferBarRef) => {
      bufferBarRef.style.width = `0`;
    });
  };

  const isFocusing = useRef(false);

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
    if (!controlsRef.current) return;
    controlsRef.current.classList.remove("hide");

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      handleMouseOut();
    }, 3000);
  };
  const handleMouseOut = () => {
    if (videoRef.current.paused) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    controlsRef.current.classList.add("hide");
  };

  const handleContextMenu = (e) => {
    // e.preventDefault();
    handleHover();
  };

  const checkBufferedOnTrackChange = () => {
    if (timeIntervalRef.current) {
      clearInterval(timeIntervalRef.current);
    }

    timeIntervalRef.current = setInterval(() => {
      checkBuffered();
    }, 250);
  };

  const checkBuffered = () => {
    // console.log("running");
    if (!videoRef.current) return;
    const video = videoRef.current;
    const currentTime = video.currentTime;
    if (video.buffered.length > 0) {
      const lastBufferIndex = video.buffered.length - 1;
      const end = video.buffered.end(lastBufferIndex);
      if (end > currentTime && end - currentTime > 2) {
        spinnerRef.current.classList.remove("visible");
        if (timeIntervalRef.current) {
          clearInterval(timeIntervalRef.current);
        }
      } else if (currentTime > end || end - currentTime < 0) {
        spinnerRef.current.classList.add("visible");
      }
    } else {
      spinnerRef.current.classList.add("visible");
    }
  };

  const clickRef = useRef();
  let clicks = useRef(0);
  const handleDoubleClick = () => {
    if (clickRef.current) {
      clearTimeout(clickRef.current);
    }
    clicks.current += 1;
    if (clicks.current === 2) {
      dispatch(handleFullscreen(fullScreen));
    }

    clickRef.current = setTimeout(() => {
      clicks.current = 0;
    }, 300);
  };

  return (
    <>
      <div className={`player-outer`} ref={containerRef} onMouseEnter={handleHover} onMouseOut={handleMouseOut} onMouseMove={handleMouseMove}>
        <video
          ref={videoRef}
          className={`html5-player`}
          id='html5-player'
          onTimeUpdate={checkBuffered}
          // onWaiting={handleTracksChanged}
          onProgress={updateBufferBar}
          onClick={handlePlayState}
          onPlay={(e) => {
            setPlay(true);
            updateProgess(e);
          }}
          onPause={() => {
            setPlay(false);
            clearIntervalProgress();
          }}
          controls={false}
          onContextMenuCapture={handleContextMenu}
          onEnded={() => toPause()}
        ></video>
        <div className='player-inner-absolute'>
          <div className='loader' ref={spinnerRef}>
            <svg viewBox='25 25 50 50'>
              <circle r='20' cy='50' cx='50'></circle>
            </svg>
          </div>
          <div
            className='player-inner-relative'
            ref={controlsRef}
            onMouseEnter={handleHover}
            onMouseOut={handleMouseOut}
            onMouseMove={handleMouseMove}
          >
            <Chapters
              updateProgressBar={updateProgressBar}
              updateRedDot={updateRedDot}
              handleMouseMove={handleMouseMove}
              videoRef={videoRef}
              innerChapterContainerRef={innerChapterContainerRef}
              chapters={chapters}
              redDotRef={redDotRef}
              redDotWrapperRef={redDotWrapperRef}
              chapterContainerRef={chapterContainerRef}
              resetDot={resetDot}
              startDrag={startDrag}
              stopDragging={stopDragging}
              handleClick={handleClick}
              updateScrubbingBar={updateScrubbingBar}
              isFocusing={isFocusing}
            />
            <BottomControls handlePlayState={handlePlayState} isFocusing={isFocusing} handleMouseMove={handleMouseMove} />
          </div>
        </div>
      </div>
    </>
  );
}
