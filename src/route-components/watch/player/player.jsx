import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import shaka from "shaka-player/dist/shaka-player.ui.js";
import "./player.css";
import BottomControls from "./player-components/bottom-controls/bottom-controls";
import Chapters from "./player-components/chapters/chapters";
import generateChapters from "./player-components/chapters/chaptersGen";
import { toPause, toPlay } from "./utilities/gsap-animations";
import { usePlayerProgressBarLogic } from "./utilities/player-progressBar-logic";
import { usePlayerMouseMove } from "./utilities/player-mouse-interactions";
import Loader from "./utilities/loader";
import ScrubbingPreviews from "./player-components/scrubbing-previews/scrubbing-previews";
import {
  handleTranslatingHere,
  toggleCaptions,
  updateChapters,
  updatePlay,
  updatePreferredRes,
  updateResolution,
} from "../../../store/Slices/player-slice";
import Settings from "./player-components/bottom-controls/bc-components/settings/settings";
import { usePlayerScrubbingBarInteractions } from "./utilities/player-scrubbingBar-logic";
import { usePlayerBufferingState, usePlayerDraggingLogic } from "./utilities/player-dragging-logic";
import { usePlayerClickInteractions, usePlayerkeyInteractions } from "./utilities/player-key-interactions";
import { usePlayerStyles } from "./utilities/player-styles";
import { useFullscreenMode, useMiniPlayermode, useTheatreMode } from "./utilities/player-modes";
import { PreviewBgSize } from "./utilities/preview-bg-size";
import PreviewBG from "./player-components/preview-bg/preview-bg";
import { toggleTheatreMode, updatePlayingVideo } from "../../../store/Slices/watch-slice";
import TopVideoComponent from "./player-components/bottom-controls/bc-components/title-component";
import { Exclamation } from "../../../assets/icons";
import { debounce } from "lodash";

export default function Player({ videoRef, containerRef }) {
  const dispatch = useDispatch();
  const location = useSelector((state) => state.app.location);
  const playingVideo = useSelector((state) => state.watch.playingVideo);
  const theatreMode = useSelector((state) => state.watch.theatreMode);
  const fullScreen = useSelector((state) => state.watch.fullScreen);
  const miniPlayer = useSelector((state) => state.watch.miniPlayer);
  const miniPlayerBoolean = useSelector((state) => state.watch.miniPlayerBoolean);
  const buffering = useSelector((state) => state.player.buffering);
  const subtitles = useSelector((state) => state.player.subtitles);
  const windowWidth = useSelector((state) => state.app.windowWidth);
  const { description_string, duration, video_id, mpd_url, isLive, captions_url } = playingVideo;

  const chapters = useSelector((state) => state.player.chapters);
  const play = useSelector((state) => state.player.play);
  const [handleMouseMove, handleHover, handleMouseOut] = usePlayerMouseMove();
  const [updateBufferBar, updateProgressBar] = usePlayerProgressBarLogic();
  const [updateScrubbingBar, previewCanvas, movePreviews] = usePlayerScrubbingBarInteractions();
  const [startDrag, stopDragging, handleClick, handleDrag, updateRedDot, resetDot, isDragging] = usePlayerDraggingLogic();
  const [handleKeyPress, handleKeyUp, focusViaKeyBoard] = usePlayerkeyInteractions();
  const [applyChapterStyles, calculateWidth] = usePlayerStyles();
  const [toggleMiniPlayer] = useMiniPlayermode();
  const [toggleTheatre] = useTheatreMode();
  const [toggleFullScreen] = useFullscreenMode();
  const [handleDoubleClick, handlePlayState] = usePlayerClickInteractions();
  const [checkBufferedOnTrackChange, checkBuffered, clearIntervalOnTrackChange] = usePlayerBufferingState();
  const playerRef = useRef(null);
  const redDotRef = useRef();
  const redDotWrapperRef = useRef();
  const chapterContainerRef = useRef();
  const innerChapterContainerRef = useRef();
  const timeIntervalRef = useRef();
  const spinnerRef = useRef();
  const intervalRef = useRef();
  const controlsRef = useRef();
  const attempts = useRef(0);

  useEffect(() => {
    dispatch(updatePreferredRes(false));
    if (isLive) {
      dispatch(updateChapters([{ start: 0, title: "", end: 50 }]));
    } else {
      const generatedChapters = generateChapters(description_string, duration);
      dispatch(updateChapters(generatedChapters));
    }
  }, [playingVideo]);

  useEffect(() => {
    applyChapterStyles();
  }, [chapters]);

  const updateStyles = () => {
    calculateWidth();

    applyChapterStyles();
    updateBufferBar();
    updateProgressBar();
    updateRedDot("");
  };

  useEffect(() => {
    updateStyles();
  }, [windowWidth, location]);

  useEffect(() => {
    const debouncedVer = debounce(updateStyles, 200);

    window.addEventListener("resize", debouncedVer);

    return () => {
      window.removeEventListener("resize", debouncedVer);
    };
  }, [location, windowWidth, chapters, video_id, fullScreen, theatreMode]);
  useLayoutEffect(() => {
    // for detaching player when user moves away from the watchpage
    const isWatchpage = location.includes("watch");

    if (miniPlayerBoolean === false && isWatchpage === false) {
      videoRef.current.pause();
      clearIntervalProgress();
      detachPlayer();
      dispatch(updatePlayingVideo({}));
    }
  }, [location]);

  useLayoutEffect(() => {
    // for browsing in miniplayer mode
    const isWatchpage = window.location.pathname.includes("watch");

    if (!isWatchpage && miniPlayer) {
      clearIntervalProgress();
      resetBars();
      calculateWidth();
      attatchPlayer();
    }
  }, [playingVideo]);

  useLayoutEffect(() => {
    // for browsing in the watchpage
    if (window.location.pathname.includes("watch")) {
      clearIntervalProgress();
      resetBars();
      calculateWidth();
      attatchPlayer();
    } else {
      playerRef.current = null;
    }
  }, [playingVideo, video_id]);

  useEffect(() => {
    handleHover();
    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [play, theatreMode, fullScreen, location]);

  useLayoutEffect(() => {
    toggleTheatre();
  }, [theatreMode]);

  useLayoutEffect(() => {
    toggleFullScreen();
  }, [fullScreen]);

  useLayoutEffect(() => {
    toggleMiniPlayer();
  }, [miniPlayer, theatreMode, fullScreen]);

  useEffect(() => {
    const isWatchpage = location.includes("watch") || window.location.pathname.includes("watch");

    if (isWatchpage) {
      checkBufferedOnTrackChange();
    } else {
      clearIntervalOnTrackChange();
    }
  }, [video_id, location]);

  useLayoutEffect(() => {
    const theatre = JSON.parse(localStorage.getItem("theatreMode"));
    dispatch(toggleTheatreMode(theatre));
  }, []);

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
          bufferingGoal: 100,
          rebufferingGoal: 2,
        },
      });

      // Listen for error events
      playerRef.current.addEventListener("error", (event) => {
        console.error("Error code", event.detail.code);
      });

      playerRef.current.addEventListener("trackschanged", () => {
        console.log("Tracks have been loaded!");
        // const tracksInfo = playerRef.current.getVariantTracks();
        // const tracks = tracksInfo.map((track) => {
        //   return track.height;
        // });
      });

      playerRef.current.addEventListener("adaptation", (value) => {
        const newTrack = value.newTrack.height;
        const { resolutions } = playingVideo;
        const resolution = resolutions.find((res) => res.height === newTrack);
        const tag = `${resolution.tag}${resolution.framerate > 30 ? Math.round(resolution.framerate) : ""}`;
        dispatch(updateResolution(tag));
      });

      // Load the manifest
      playerRef.current
        .load(manifestUri)
        .then(() => {
          if (subtitles !== "Off" && captions_url) {
            dispatch(toggleCaptions(playerRef, captions_url[0].url, captions_url[0].language));
          }

          console.log("The video has been loaded!");
          handlePlayState();
          const videoRef = document.querySelector("#html5-player");
          if (videoRef) {
            const params = new URLSearchParams(window.location.search);
            const time = params.get("t") || 0;
            videoRef.currentTime = time;
          }
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
    const redDotWrapperRef = document.querySelector(".red-dot-wrapper");
    const scrubbingBarRefs = document.querySelectorAll(".scrubbing.bar");
    const bufferBarRefs = document.querySelectorAll(".buffer.bar");
    const progressBarRefs = document.querySelectorAll(".progress.bar");
    const arr = [{ ref: scrubbingBarRefs }, { ref: bufferBarRefs }, { ref: progressBarRefs }];
    arr.forEach((barRefs) => {
      barRefs.ref.forEach((barRef) => {
        barRef.style.width = `0%`;
      });
    });
    redDotWrapperRef.style.transform = `translateX(${0}px)`;
  };

  const detachPlayer = async () => {
    // console.log("run");
    const captionsContainer = document.querySelector(".captions-container-relative");
    if (captionsContainer) {
      while (captionsContainer.firstChild) {
        captionsContainer.removeChild(captionsContainer.firstChild);
      }
    }

    if (playerRef.current !== null) {
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
      }

      clearIntervalProgress();
      await playerRef.current.unload();
      playerRef.current = null;
    }
  };

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
    clearIntervalOnTrackChange();
  };

  useEffect(() => {
    if (buffering) {
      clearInterval(intervalRef.current);
    } else if (!buffering && play) {
      updateProgess();
    }
  }, [buffering]);

  const handleContextMenu = (e) => {
    // e.preventDefault();
    handleHover();
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

  const handleTimeUpdate = () => {
    const videoRef = document.querySelector("#html5-player");

    if (videoRef.paused && isDragging.current === false) {
      updateProgressBar();
      updateRedDot();
    }

    checkBuffered();
  };
  return (
    <>
      <div
        className={`player-outer`}
        ref={containerRef}
        tabIndex={0}
        onMouseEnter={handleHover}
        onMouseLeave={handleMouseOut}
        onMouseMove={handleMouseMove}
        onFocus={handlePlayerFocus}
        onBlur={handlePlayerBlur}
        onClick={handlePlayerClick}
        onClickCapture={handlePlayerClick}
      >
        <video
          // poster={preferred_thumbnail_url ? preferred_thumbnail_url : possible_thumbnail_urls && possible_thumbnail_urls["thumbnailUrl-0"]}
          onDoubleClickCapture={handleDoubleClick}
          onDoubleClick={handleDoubleClick}
          ref={videoRef}
          className={`html5-player`}
          id='html5-player'
          onTimeUpdate={handleTimeUpdate} // continue updating the chapters
          // onWaiting={handleTracksChanged}
          onProgress={updateBufferBar}
          onClick={handlePlayState}
          onPlay={(e) => {
            toPlay();
            dispatch(updatePlay(true));
            updateProgess(e);
          }}
          onPause={() => {
            toPause();
            dispatch(updatePlay(false));
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
          <PreviewBG />
          <Loader spinnerRef={spinnerRef} />
          <div className={`processing-banner ${mpd_url ? "hide" : ""}`}>
            <p className='processing-title'>
              <Exclamation /> Processing...
            </p>
          </div>
          <div className={`player-inner-relative ${!mpd_url ? "processing" : ""}`} ref={controlsRef}>
            <TopVideoComponent />
            <Settings playerRef={playerRef} checkBufferedOnTrackChange={checkBufferedOnTrackChange} />
            <ScrubbingPreviews videoRef={videoRef} />
            <Chapters
              videoRef={videoRef}
              innerChapterContainerRef={innerChapterContainerRef}
              redDotRef={redDotRef}
              redDotWrapperRef={redDotWrapperRef}
              chapterContainerRef={chapterContainerRef}
            />
            <BottomControls handlePlayState={handlePlayState} miniPlayerBoolean={miniPlayerBoolean} playerRef={playerRef} />
          </div>
        </div>
      </div>
      <PreviewBgSize />
    </>
  );
}
