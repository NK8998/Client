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
import { updateChapters, updatePlay, updatePreferredRes, updateResolution } from "../../../store/Slices/player-slice";
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

export default function Player({ videoRef, containerRef }) {
  const dispatch = useDispatch();
  const location = useSelector((state) => state.app.location);
  const playingVideo = useSelector((state) => state.watch.playingVideo);
  const theatreMode = useSelector((state) => state.watch.theatreMode);
  const fullScreen = useSelector((state) => state.watch.fullScreen);
  const miniPlayer = useSelector((state) => state.watch.miniPlayer);
  const miniPlayerBoolean = useSelector((state) => state.watch.miniPlayerBoolean);
  const buffering = useSelector((state) => state.player.buffering);
  const urlTime = useSelector((state) => state.player.urlTime);
  const { description_string, duration, video_id, mpd_url, isLive } = playingVideo;

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
  const playerRef = useRef();
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
    const videoRef = document.querySelector("#html5-player");
    if (urlTime && videoRef) {
      videoRef.currentTime = urlTime;
      updateProgressBar();
    }
  }, [chapters, urlTime]);

  useEffect(() => {
    const handlePlayerResizing = () => {
      if (document.fullscreenElement || fullScreen) return;
      calculateWidth();
      // updateBufferBar();
      // updateProgressBar();
    };
    // const isWatchpage = location.includes("watch") || window.location.pathname.includes("watch");
    // if (isWatchpage === false) {
    //   window.removeEventListener("resize", handlePlayerResizing);
    // } else if (isWatchpage === true) {
    //   window.addEventListener("resize", handlePlayerResizing);
    // }
    window.addEventListener("resize", handlePlayerResizing);

    return () => {
      window.removeEventListener("resize", handlePlayerResizing);
    };
  }, [location, video_id, theatreMode]);

  useLayoutEffect(() => {
    // for detaching player when user moves away from the watchpage
    const isWatchpage = location.includes("watch");

    if (miniPlayerBoolean === false && isWatchpage === false) {
      videoRef.current.pause();
      clearIntervalProgress();
      detachPlayer();
      window.removeEventListener("resize", calculateWidth);
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

  const updateStyles = () => {
    applyChapterStyles();
    updateBufferBar();
    updateProgressBar();
    updateRedDot("");
  };

  useEffect(() => {
    // const isWatchpage = location.includes("watch") || window.location.pathname.includes("watch");
    // if (isWatchpage) {
    //   window.addEventListener("resize", updateStyles);
    // } else if (!isWatchpage) {
    //   window.removeEventListener("resize", updateStyles);
    // }
    window.addEventListener("resize", updateStyles);

    return () => {
      window.removeEventListener("resize", updateStyles);
    };
  }, [location, video_id, theatreMode, chapters]);

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
        const tracksInfo = playerRef.current.getVariantTracks();
        const tracks = tracksInfo.map((track) => {
          return track.height;
        });
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
    if (playerRef.current) {
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
          onTimeUpdate={checkBuffered} // continue updating the chapters
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
