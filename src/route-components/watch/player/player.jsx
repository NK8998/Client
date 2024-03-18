import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import shaka from "shaka-player/dist/shaka-player.ui.js";
import "./player.css";
import BottomControls from "./player-components/bottom-controls/bottom-controls";
import Chapters from "./player-components/chapters/chapters";
import generateChapters from "./player-components/chapters/chaptersGen";
import { toNormal, toPause, toPlay, toTheatre } from "./utilities/gsap-animations";
import { seekVideo, updateBufferBar, updateProgressBar } from "./utilities/player-progressBar-logic";
import { usePlayerMouseMove } from "./utilities/player-mouse-interactions";
import { handleFullscreen, handleTheatre } from "../../../store/Slices/watch-slice";
import Loader from "./utilities/loader";
import ScrubbingPreviews from "./player-components/scrubbing-previews/scrubbing-previews";
import { getTimeStamp } from "../../../utilities/getTimestamp";
import { updatePreferredRes, updateResolution } from "../../../store/Slices/player-slice";
import Settings from "./player-components/bottom-controls/bc-components/settings/settings";

export default function Player({ videoRef, secondaryRef, containerRef, expandedContainerRef, primaryRef, miniplayerRef, miniPlayerBoolean }) {
  const dispatch = useDispatch();
  const location = useSelector((state) => state.app.location);
  const playingVideo = useSelector((state) => state.watch.playingVideo);
  const theatreMode = useSelector((state) => state.watch.theatreMode);
  const fullScreen = useSelector((state) => state.watch.fullScreen);
  const miniPlayer = useSelector((state) => state.watch.miniPlayer);
  const settingsShowing = useSelector((state) => state.player.settingsShowing);
  const { description_string, duration, video_id, mpd_url, aspect_ratio, palette_urls, extraction_and_palette } = playingVideo;

  const [chapters, setChapters] = useState([{ start: 0, title: "", end: 50 }]);
  const [play, setPlay] = useState(false);
  const [handleMouseMove, handleHover, handleMouseOut] = usePlayerMouseMove();
  const playerRef = useRef();
  const redDotRef = useRef();
  const redDotWrapperRef = useRef();
  const chapterContainerRef = useRef();
  const innerChapterContainerRef = useRef();
  const timeIntervalRef = useRef();
  const spinnerRef = useRef();
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
  const controlsRef = useRef();
  const attempts = useRef(0);
  const layoutShiftRef = useRef();
  const timeoutClick = useRef();

  useEffect(() => {
    const generatedChapters = generateChapters(description_string, duration);

    setChapters(generatedChapters);
    dispatch(updatePreferredRes(false));
  }, [playingVideo]);

  useEffect(() => {
    applyChapterStyles();
  }, [chapters]);

  useEffect(() => {
    const isWatchpage = location.includes("watch") || window.location.pathname.includes("watch");
    if (isWatchpage === false) {
      window.removeEventListener("resize", calculateWidth);
    } else if (isWatchpage === true) {
      window.addEventListener("resize", calculateWidth);
    }

    return () => {
      window.removeEventListener("resize", calculateWidth);
    };
  }, [location, video_id, theatreMode]);

  useLayoutEffect(() => {
    // console.log(location);
    const isWatchpage = location.includes("watch");
    if (miniPlayerBoolean.current === false) {
      if (!isWatchpage) {
        videoRef.current.pause();
        clearIntervalProgress();
        detachPlayer();
        window.removeEventListener("resize", calculateWidth);
      } else if (isWatchpage && playerRef.current === null) {
        // console.log("I ran");
        attatchPlayer();
        calculateWidth();
        applyChapterStyles();
      }
    }
  }, [location]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      const isWatchpage = location.includes("watch") || window.location.pathname.includes("watch");
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
        updateBufferBar(chapters);
        updateProgressBar(chapters);
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
        if (!isWatchpage) return;
        if (fullScreenTimeout.current) {
          clearTimeout(fullScreenTimeout.current);
        }
        fullScreenTimeout.current = setTimeout(() => {
          dispatch(handleFullscreen(fullScreen));
        }, 400);
      }
    };

    const handleKeyUp = (e) => {
      focusViaKeyBoard.current = true;
      const isWatchpage = location.includes("watch") || window.location.pathname.includes("watch");
      const key = e.key.toLowerCase();

      if (key === " ") {
        !isHolding.current && handlePlayState();
        videoRef.current.playbackRate = 1;
        clearTimeout(timeoutRef2.current);
        timeoutRef2.current = null;
        isHolding.current = false;
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

  useEffect(() => {
    const isWatchpage = location.includes("watch") || window.location.pathname.includes("watch");
    if (isWatchpage) {
      window.addEventListener("resize", updateStyles);
    } else if (!isWatchpage) {
      window.removeEventListener("resize", updateStyles);
    }

    return () => {
      window.removeEventListener("resize", updateStyles);
    };
  }, [location, video_id, theatreMode, chapters]);

  useLayoutEffect(() => {
    toggleTheatre();
  }, [theatreMode]);

  useLayoutEffect(() => {
    toggleFullScreen();

    return () => {
      const root = document.querySelector("#root");
      if (!root) return;
      root.removeEventListener("scroll", handleScrollPosition);
    };
  }, [fullScreen]);

  useLayoutEffect(() => {
    if (!miniplayerRef.current) return;
    if (!miniPlayer) {
      if (layoutShiftRef.current) {
        clearTimeout(layoutShiftRef.current);
      }
      miniplayerRef.current.classList.remove("visible");

      if (Array.from(miniplayerRef.current.children).includes(containerRef.current)) {
        miniplayerRef.current.removeChild(containerRef.current);
        if (theatreMode) {
          primaryRef.current.classList.remove("has-content");
          expandedContainerRef.current.append(containerRef.current);
        } else {
          primaryRef.current.append(containerRef.current);
          expandedContainerRef.current.classList.remove("has-content");
        }
        containerRef.current.classList.remove("miniplayer");
        videoRef.current.classList.remove("miniplayer");
        // toggle regular

        handleMouseOut();
        controlsRef.current.classList.add("transition");
        layoutShiftRef.current = setTimeout(() => {
          calculateWidth();
          applyChapterStyles();
          updateRedDot("");
          controlsRef.current.classList.remove("transition");
          handleMouseMove();
        }, 50);
      }
    } else if (miniPlayer) {
      // toggle miniPlayer
      if (Array.from(primaryRef.current.children).includes(containerRef.current)) {
        primaryRef.current.removeChild(containerRef.current);
        miniplayerRef.current.append(containerRef.current);
        primaryRef.current.classList.add("has-content");
      } else if (Array.from(expandedContainerRef.current.children).includes(containerRef.current)) {
        expandedContainerRef.current.removeChild(containerRef.current);
        miniplayerRef.current.append(containerRef.current);
        expandedContainerRef.current.classList.add("has-content");
      }
      applyChapterStyles();
      updateRedDot("");
      miniplayerRef.current.classList.add("visible");

      containerRef.current.classList.add("miniplayer");
      videoRef.current.classList.add("miniplayer");
    }
  }, [miniPlayer, theatreMode, fullScreen]);

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
    // console.log("togglefullscreen ran");

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
      expandedContainerRef.current.classList.remove("has-content");

      if (Array.from(primaryRef.current.children).includes(containerRef.current)) {
        primaryRef.current.removeChild(containerRef.current);
        expandedContainerRef.current.append(containerRef.current);
      }
      primaryRef.current.classList.remove("has-content");

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
      // console.log("exiting fullscreen");
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
      containerRef.current.classList.remove("fullscreen");
      if (Array.from(expandedContainerRef.current.children).includes(containerRef.current) && !theatreMode) {
        expandedContainerRef.current.removeChild(containerRef.current);
        expandedContainerRef.current.classList.remove("has-content");
        const firstChild = primaryRef.current.firstChild;
        primaryRef.current.insertBefore(containerRef.current, firstChild);
        videoRef.current.classList.remove("theatre");
        containerRef.current.classList.remove("theatre");
        primaryRef.current.classList.add("has-content");
      }
      if (theatreMode) {
        primaryRef.current.classList.remove("has-content");
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
    // console.log("toggletheatre ran");

    const isWatchpage = location.includes("watch") || window.location.pathname.includes("watch");
    if (!isWatchpage) return;
    if (!primaryRef.current || !containerRef.current) return;

    if (Array.from(primaryRef.current.children).includes(containerRef.current) && primaryRef.current && theatreMode) {
      primaryRef.current.classList.remove("has-content");
      if (Array.from(primaryRef.current.children).includes(containerRef.current)) {
        primaryRef.current.removeChild(containerRef.current);
        expandedContainerRef.current.append(containerRef.current);
        expandedContainerRef.current.classList.add("has-content");
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
        expandedContainerRef.current.classList.remove("has-content");
        const firstChild = primaryRef.current.firstChild;
        primaryRef.current.insertBefore(containerRef.current, firstChild);
        primaryRef.current.classList.add("has-content");
      }
      videoRef.current.classList.remove("theatre");
      containerRef.current.classList.remove("theatre");
      applyChapterStyles();
      calculateWidth();

      updateRedDot("");
      toNormal();
    }
  };

  useEffect(() => {
    checkBufferedOnTrackChange();
  }, [video_id, location]);

  useLayoutEffect(() => {
    if (window.location.pathname.includes("watch")) {
      clearIntervalProgress();
      resetBars();
      calculateWidth();
      attatchPlayer();
    } else {
      playerRef.current = null;
    }
  }, [playingVideo, video_id]);

  const attatchPlayer = async () => {
    await detachPlayer();
    const manifestUri = mpd_url || "";
    if (manifestUri.length === 0 || !manifestUri.includes("http") || !videoRef.current) return;
    shaka.polyfill.installAll();
    if (shaka.Player.isBrowserSupported()) {
      playerRef.current = new shaka.Player();
      playerRef.current.attach(videoRef.current);

      const videoContainer = document.querySelector(".captions-container-relative");
      const ui = new shaka.ui.Overlay(playerRef.current, videoContainer, videoRef.current);
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

      playerRef.current.addEventListener("adaptation", (value) => {
        const newTrack = value.newTrack.height;
        const { resolutions } = playingVideo;
        const resolution = resolutions.find((res) => res.height === newTrack);
        dispatch(updateResolution(resolution.tag));
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
    // console.log("run");
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
    const root = document.querySelector("#root");
    if (!root) return;

    let secondaryRefWidth = 0;
    if (secondaryRef.current) {
      secondaryRefWidth = secondaryRef.current.clientWidth;
    }
    const windowWidth = root.clientWidth;
    const windowHeight = window.innerHeight < 800 ? 800 : window.innerHeight;

    const gaps = windowWidth >= 1041 ? 74 : 46;
    const maxVideoHeight = (73.5 * window.innerHeight) / 100;
    const remainingSpace = windowWidth - (gaps + secondaryRefWidth);
    // const aspect_ratio = wideScreen ? 1920 / 1080 : 16 / 9;

    let videoHeight = remainingSpace * aspect_ratio > maxVideoHeight ? maxVideoHeight : remainingSpace * aspect_ratio;
    let videoWidth = videoHeight * aspect_ratio;

    // Check if the videoWidth is greater than the remainingSpace
    if (videoWidth > remainingSpace) {
      // Adjust the videoWidth and videoHeight to fit the remaining space
      videoWidth = remainingSpace;
      videoHeight = videoWidth * (1 / aspect_ratio);
    }

    if (videoWidth >= 1280) {
      videoWidth = 1280;
      videoHeight = videoWidth * (1 / aspect_ratio);
    }

    // console.log({ remainingSpace });
    // console.log({ videoHeight, videoWidth });
    document.documentElement.style.setProperty("--height", `${Math.round(videoHeight)}px`);
    document.documentElement.style.setProperty("--width", `${Math.round(videoWidth)}px`);
    const newRatio = 16 / 9;
    const theatreWidth = windowWidth;
    const calculatedHeight = windowWidth * (1 / newRatio);
    const maxHeight = 0.795 * windowHeight;
    let theatreHeight = Math.trunc(calculatedHeight > maxHeight ? maxHeight : calculatedHeight);
    if (windowWidth <= 810) {
      theatreHeight = Math.trunc(0.55 * windowHeight);
    }
    document.documentElement.style.setProperty("--theatreHeight", `${theatreHeight}px`);
    document.documentElement.style.setProperty("--theatreWidth", `${theatreWidth}px`);
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

  const updatePreviewLeft = (e) => {
    const scrubbingPreviewContainer = document.querySelector(".scrubbing-preview-container");
    const scrubbingPreviewContainerWidth = scrubbingPreviewContainer.clientWidth;
    const chaptersContainerWidth = chapterContainerRef.current.clientWidth;
    const chaptersContainerLeft = chapterContainerRef.current.getBoundingClientRect().left;
    const chaptersContainerRight = chapterContainerRef.current.getBoundingClientRect().right;
    const cursorPosition = e.clientX;
    const clientPosition = cursorPosition - chaptersContainerLeft;
    const percentage = (clientPosition / chaptersContainerWidth) * 100;
    let scrubbingLeft = `calc(${percentage}% - ${scrubbingPreviewContainerWidth / 2}px)`;
    const boundary = scrubbingPreviewContainerWidth / 2 + 10;
    if (clientPosition < boundary) {
      scrubbingLeft = `calc(0% + 10px)`;
    } else if (chaptersContainerRight - cursorPosition < boundary) {
      scrubbingLeft = `calc(100% - ${scrubbingPreviewContainerWidth + 10}px)`;
    }
    scrubbingPreviewContainer.style.left = scrubbingLeft;
  };

  const retrieveCurPalleteAndTile = (currentTime, element, dimensions) => {
    const { width, height } = dimensions;
    const { paletteSize, extractionRate } = extraction_and_palette;

    const pallete = paletteSize * paletteSize;
    const timePerPallete = extractionRate * pallete;
    const currentPallete = Math.floor(currentTime / timePerPallete);
    // Get the total elapsed time within all palettes
    const elapsedTimeWithinCurrentPallete = currentTime - currentPallete * timePerPallete;

    const currentTile = Math.floor(elapsedTimeWithinCurrentPallete / extractionRate) + 1;

    const backgroundPallete = palette_urls[`palleteUrl-${currentPallete}`];

    const offsetX = ((currentTile - 1) % paletteSize) * width;
    const offsetY = Math.floor((currentTile - 1) / paletteSize) * height;
    element.style.backgroundSize = `${width * paletteSize}px ${height * paletteSize}px`;
    let backgroundImage = element.style.backgroundImage;
    let url = backgroundImage.slice(5, backgroundImage.length - 2);
    if (url !== backgroundPallete) {
      element.style.backgroundImage = `url(${backgroundPallete})`;
    }
    element.style.backgroundPosition = `-${offsetX}px -${offsetY}px`;
  };

  const previewCanvas = (currentTime) => {
    const previewImageBg = document.querySelector(".preview-image-bg");
    previewImageBg.classList.add("show");
    const style = getComputedStyle(document.documentElement);

    let height;
    let width;
    if (!theatreMode) {
      height = parseInt(style.getPropertyValue("--height").split("px")[0]);
      width = parseInt(style.getPropertyValue("--width").split("px")[0]);
    } else if (theatreMode) {
      const theatreHeight = parseInt(style.getPropertyValue("--theatreHeight").split("px")[0]);
      const theatreWidth = parseInt(style.getPropertyValue("--theatreWidth").split("px")[0]);
      height = theatreWidth * aspect_ratio;
      width = theatreHeight * aspect_ratio;
      if (width > theatreWidth) {
        width = theatreWidth;
        height = width * (1 / aspect_ratio);
      }
      if (height > theatreHeight) {
        height = theatreHeight;
      }
    }
    if (miniPlayer) {
      width = 400;
      height = 400 * (1 / aspect_ratio);
    }
    if (fullScreen) {
      width = parseInt(style.getPropertyValue("--theatreWidth").split("px")[0]);
      height = width * (1 / aspect_ratio);
    }
    previewImageBg.style.height = `${height}px`;
    previewImageBg.style.width = `${width}px`;
    const dimensions = { width: width, height: height };

    retrieveCurPalleteAndTile(currentTime, previewImageBg, dimensions);
  };

  const movePreviews = (e, hoveringIndex) => {
    const previewTime = document.querySelector(".preview-time");
    const scrubbingPreview = document.querySelector(".preview-img-container");
    const chaptersContainers = document.querySelectorAll(".chapter-padding");
    const chapterDuration = chapters[hoveringIndex].end - chapters[hoveringIndex].start;
    const currentChapterLeft = chaptersContainers[hoveringIndex].getBoundingClientRect().left;
    const currentChapterWidth = chaptersContainers[hoveringIndex].getBoundingClientRect().width;
    const position = e.clientX - currentChapterLeft;
    const ratio = position / currentChapterWidth;
    const timeOffset = ratio * chapterDuration;
    const currentTime = chapters[hoveringIndex].start + timeOffset;
    const timeStamp = getTimeStamp(Math.trunc(currentTime));
    previewTime.textContent = timeStamp;
    const width = scrubbingPreview.clientWidth;
    const height = scrubbingPreview.clientHeight;
    const dimensions = { width: width, height: height };
    retrieveCurPalleteAndTile(currentTime, scrubbingPreview, dimensions);

    updatePreviewLeft(e);
  };

  const updateScrubbingBar = (e) => {
    const scrubbingPreviewContainer = document.querySelector(".scrubbing-preview-container");
    if (!settingsShowing) {
      scrubbingPreviewContainer.classList.add("show");
    }
    handleHover();
    const hoveringIndex = e.target.getAttribute("dataIndex");
    document.documentElement.style.setProperty("--hoverChapterIndex", `${hoveringIndex}`);

    if (hoveringIndex) {
      movePreviews(e, hoveringIndex);
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
    // console.log(currentTime);

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
    previewCanvas(currentTime);
    movePreviews(e, currentIndex);
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

  const stopDragging = () => {
    const scrubbingPreviewContainer = document.querySelector(".scrubbing-preview-container");
    const previewImageBg = document.querySelector(".preview-image-bg");
    previewImageBg.classList.remove("show");
    document.documentElement.style.setProperty("--select", "");
    const style = getComputedStyle(document.documentElement);
    if (mouseDownTracker.current) {
      clearTimeout(mouseDownTracker.current);
    }
    videoRef.current.currentTime = currentTimeTracker.current;
    isDragging.current = false;
    scrubbingPreviewContainer.classList.remove("show");
    if (play) {
      videoRef.current.play();
      toPlay();
    }
    videoRef.current.style.visibility = "visible";
    window.removeEventListener("mousemove", handleDrag);
    window.removeEventListener("mouseup", stopDragging);

    setTimeout(() => {
      const chaptersContainers = document.querySelectorAll(".chapter-padding");
      chaptersContainers.forEach((chaptersContainer, index) => {
        chaptersContainer.classList.remove("drag-expand");
      });
    }, 30);

    const hovering = style.getPropertyValue("--hovering").trim();
    if (hovering === "false") {
      resetDot();
    }
    innerChapterContainerRef.current.classList.remove("drag-expand");
  };

  const startDrag = (e) => {
    document.documentElement.style.setProperty("--select", "none");
    mouseDownTracker.current = setTimeout(() => {
      handleDrag(e);
      videoRef.current.pause();
      toPause();
      isDragging.current = true;
      videoRef.current.style.visibility = "hidden";
      innerChapterContainerRef.current.classList.add("drag-expand");
      window.addEventListener("mousemove", handleDrag);
      window.addEventListener("mouseup", stopDragging);
    }, 130);
  };

  // const updateProgressAndBufferBars = (e) => {

  //     updateBufferBar(e);
  //     updateProgressBar(e);
  //     updateRedDot();

  // };

  const updateProgess = (e) => {
    toPlay();
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      // console.log("running");
      updateBufferBar(chapters);
      updateProgressBar(chapters);
      updateRedDot("");
    }, 60);
  };

  const clearIntervalProgress = () => {
    toPause();
    clearInterval(intervalRef.current);
  };

  const resetDot = () => {
    document.documentElement.style.setProperty("--hovering", `false`);
    redDotRef.current.style.scale = 0;
  };

  function applyChapterStyles() {
    const chaptersContainers = document.querySelectorAll(".chapter-padding");
    const hoverBars = document.querySelectorAll(".chapter-hover");
    // console.log("running");
    let totalWidth = 0;
    const chapterContainerRefWidth = miniPlayer === true ? 400 : innerChapterContainerRef.current.clientWidth;

    if (chapters.length === 0) return;
    chaptersContainers.forEach((chaptersContainer, index) => {
      const calculatedPercentage = ((chapters[index].end - chapters[index].start) / chapters[chapters.length - 1].end) * 100;
      let width = Math.trunc((calculatedPercentage / 100) * chapterContainerRefWidth);
      totalWidth += width;

      if (chapters.length > 1 && index !== chapters.length - 1) {
        width -= 2;
      } else if (chapters.length > 1 && index === chapters.length - 1) {
        width += chapterContainerRefWidth - totalWidth;
      }
      hoverBars[index].style.width = `${width}px`;
      chaptersContainer.style.width = `${width}px`;
    });
  }

  const handleDoubleClick = () => {
    if (timeoutClick.current) {
      clearTimeout(timeoutClick.current);
    }

    dispatch(handleFullscreen(fullScreen));
  };
  const handlePlayState = () => {
    if (timeoutClick.current) {
      clearTimeout(timeoutClick.current);
    }
    timeoutClick.current = setTimeout(() => {
      if (videoRef.current.paused) {
        videoRef.current.play();
        toPlay();
      } else {
        handleMouseMove();
        videoRef.current.pause();
        toPause();
      }
    }, 200);
  };

  const handleBufferBarOnTrackChange = () => {
    const bufferBarRefs = document.querySelectorAll(".buffer.bar");
    bufferBarRefs.forEach((bufferBarRef) => {
      bufferBarRef.style.width = `0`;
    });
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

  const handlePlayerClick = () => {
    focusViaKeyBoard.current = false;
    containerRef.current.classList.remove("focus-via-keyboard");
  };
  const handlePlayerFocus = (e) => {
    if (focusViaKeyBoard.current === true) {
      if (containerRef.current.classList.contains("focus-via-keyboard")) return;
      containerRef.current.classList.add("focus-via-keyboard");
    }
  };

  const handlePlayerBlur = (e) => {
    containerRef.current.classList.remove("focus-via-keyboard");
  };
  return (
    <>
      <div
        className={`player-outer`}
        ref={containerRef}
        tabIndex={0}
        onMouseEnter={handleHover}
        onMouseOut={handleMouseOut}
        onMouseMove={handleMouseMove}
        onFocus={handlePlayerFocus}
        onBlur={handlePlayerBlur}
        onClick={handlePlayerClick}
        onClickCapture={handlePlayerClick}
      >
        <video
          onDoubleClickCapture={handleDoubleClick}
          onDoubleClick={handleDoubleClick}
          ref={videoRef}
          className={`html5-player`}
          id='html5-player'
          onTimeUpdate={checkBuffered}
          // onWaiting={handleTracksChanged}
          onProgress={() => updateBufferBar(chapters)}
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
        <div className='captions-container-abolute'>
          <div className='captions-container-relative'></div>
        </div>
        <div className='player-inner-absolute'>
          <div className='preview-image-bg' />
          <Loader spinnerRef={spinnerRef} />
          <div className='player-inner-relative' ref={controlsRef}>
            <Settings playerRef={playerRef} checkBufferedOnTrackChange={checkBufferedOnTrackChange} />
            <ScrubbingPreviews videoRef={videoRef} />
            <Chapters
              videoRef={videoRef}
              updateProgressBar={updateProgressBar}
              updateRedDot={updateRedDot}
              innerChapterContainerRef={innerChapterContainerRef}
              redDotRef={redDotRef}
              redDotWrapperRef={redDotWrapperRef}
              chapterContainerRef={chapterContainerRef}
              resetDot={resetDot}
              startDrag={startDrag}
              stopDragging={stopDragging}
              handleClick={handleClick}
              updateScrubbingBar={updateScrubbingBar}
              chapters={chapters}
              isDragging={isDragging}
            />
            <BottomControls handlePlayState={handlePlayState} miniPlayerBoolean={miniPlayerBoolean} playerRef={playerRef} />
          </div>
        </div>
      </div>
    </>
  );
}
