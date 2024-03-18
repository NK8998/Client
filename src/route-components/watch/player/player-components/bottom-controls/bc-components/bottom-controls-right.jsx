import { useDispatch, useSelector } from "react-redux";
import {
  CaptionsButton,
  CogButton,
  FullscreenButton,
  MiniPlayerButton,
  SmallScreenButton,
  TheatreNormalButton,
} from "../../../../../../assets/icons";
import { handleFullscreen, handleMiniPLayer, handleTheatre } from "../../../../../../store/Slices/watch-slice";
import { usePlayerMouseMove } from "../../../utilities/player-mouse-interactions";
import { useNavigate } from "react-router-dom";
import { useLayoutEffect, useRef } from "react";
import { handleTranslating, updateSettingsShowing } from "../../../../../../store/Slices/player-slice";

export const BottomControlsRight = ({ miniPlayerBoolean, playerRef }) => {
  const settingsShowing = useSelector((state) => state.player.settingsShowing);
  const fullScreen = useSelector((state) => state.watch.fullScreen);
  const theatreMode = useSelector((state) => state.watch.theatreMode);
  const miniPlayer = useSelector((state) => state.watch.miniPlayer);
  const playingVideo = useSelector((state) => state.watch.playingVideo);
  const locationsArr = useSelector((state) => state.app.locationsArr);
  const isFetching = useSelector((state) => state.app.isFetching);
  const currentPanel = useSelector((state) => state.player.currentPanel);
  const captionsRef = useRef();
  const [handleMouseMove, handleMouseOut] = usePlayerMouseMove();
  const { video_id, captions_url } = playingVideo;
  const timeoutRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleMiniPlayerNavigation = () => {
    miniPlayerBoolean.current = true;
    const nonWatchRoute = locationsArr.slice().find((path) => !path.includes("/watch")) || "/";
    // console.log(nonWatchRoute);
    navigate(`${nonWatchRoute}`);
    dispatch(handleMiniPLayer(true));
  };

  const handleKeyUp = (e) => {
    const isInputField = e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA";
    if (isInputField) return;
    if (isFetching) return;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      const key = e.key.toLowerCase();

      if (key === "i") {
        if (!miniPlayer) {
          handleMiniPlayerNavigation();
        } else {
          navigate(`/watch?v=${video_id}`);
        }
      }
    }, 400);
  };
  useLayoutEffect(() => {
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [miniPlayer, locationsArr, isFetching]);

  const toggleCaptions = () => {
    if (!captions_url) return;
    // Assuming player is an instance of shaka.Player
    const tracks = playerRef.current.getTextTracks();
    const hasCaptions = tracks.some((track) => track.kind === "subtitles");
    captionsRef.current.classList.toggle("captions-on");

    if (!hasCaptions) {
      playerRef.current
        .addTextTrackAsync(captions_url, "en", "subtitles", "text/vtt")
        .then(function () {
          console.log("Subtitle track added");
        })
        .catch(function (error) {
          console.error("Error adding subtitle track:", error);
        });
    }

    const visibility = playerRef.current.isTextTrackVisible();
    playerRef.current.setTextTrackVisibility(!visibility);
  };

  const removeSettingsOnoutsideClick = (e) => {
    const element = e.target;

    if (!element.classList.contains("settings") && !element.closest(".settings") && !element.classList.contains("cog")) {
      const settings = document.querySelector(".settings");
      const settingsClickRegion = document.querySelector(".settings-clikcregion");
      settings.classList.remove("show");
      settingsClickRegion.classList.remove("show");
      document.removeEventListener("click", removeSettingsOnoutsideClick);
      dispatch(updateSettingsShowing());
      setTimeout(() => {
        dispatch(handleTranslating(null, currentPanel, "settings-menu-selector-items"));
      }, 100);
      handleMouseOut();
    }
  };

  const handleSettingsShowing = () => {
    document.addEventListener("click", removeSettingsOnoutsideClick);
    const settings = document.querySelector(".settings");
    const settingsClickRegion = document.querySelector(".settings-clikcregion");
    settingsClickRegion.classList.toggle("show");
    settings.classList.toggle("show");
    dispatch(updateSettingsShowing());
    if (settingsShowing) {
      setTimeout(() => {
        dispatch(handleTranslating(null, currentPanel, "settings-menu-selector-items"));
      }, 100);
    }
  };
  return (
    <div className='bottom-controls-right'>
      <button
        type='button'
        className={`player-button captions ${captions_url ? "has-captions" : ""}`}
        ref={captionsRef}
        onFocus={handleMouseMove}
        onClick={toggleCaptions}
      >
        <CaptionsButton />
      </button>
      <button type='button' className='player-button cog' onFocus={handleMouseMove} onClick={handleSettingsShowing}>
        <CogButton />
      </button>
      <button type='button' className='player-button miniplayer' onClick={handleMiniPlayerNavigation} onFocus={handleMouseMove}>
        <MiniPlayerButton />
      </button>
      <button type='button' className='player-button theatre-normal' onClick={() => dispatch(handleTheatre(theatreMode))} onFocus={handleMouseMove}>
        <TheatreNormalButton />
      </button>
      <button
        type='button'
        className='player-button fullscreen-normal'
        onClick={() => dispatch(handleFullscreen(fullScreen))}
        onFocus={handleMouseMove}
      >
        {fullScreen ? <SmallScreenButton /> : <FullscreenButton />}
      </button>
    </div>
  );
};
