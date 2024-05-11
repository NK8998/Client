import { useDispatch, useSelector } from "react-redux";
import {
  CaptionsButton,
  CogButton,
  FullscreenButton,
  MiniPlayerButton,
  SmallScreenButton,
  TheatreNormalButton,
} from "../../../../../../assets/icons";
import { handleFullscreen, handleTheatre, updateMiniPlayerBoolean } from "../../../../../../store/Slices/watch-slice";
import { usePlayerMouseMove } from "../../../utilities/player-mouse-interactions";
import { useNavigate } from "react-router-dom";
import { useEffect, useLayoutEffect, useRef } from "react";
import { handleTranslating, handleTranslatingHere, toggleCaptions, updateSettingsShowing } from "../../../../../../store/Slices/player-slice";

export const BottomControlsRight = ({ playerRef }) => {
  const settingsShowing = useSelector((state) => state.player.settingsShowing);
  const fullScreen = useSelector((state) => state.watch.fullScreen);
  const theatreMode = useSelector((state) => state.watch.theatreMode);
  const miniPlayer = useSelector((state) => state.watch.miniPlayer);
  const playingVideo = useSelector((state) => state.watch.playingVideo);
  const lastVisited = useSelector((state) => state.app.lastVisited);
  const isFetching = useSelector((state) => state.app.isFetching);
  const currentPanel = useSelector((state) => state.player.currentPanel);
  const miniPlayerBoolean = useSelector((state) => state.watch.miniPlayerBoolean);
  const location = useSelector((state) => state.app.location);
  const captionsRef = useRef();
  const [handleMouseMove, handleMouseOut] = usePlayerMouseMove();
  const { video_id, captions_url } = playingVideo;
  const timeoutRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleMiniPlayerNavigation = () => {
    dispatch(updateMiniPlayerBoolean(true));
    // miniPlayerBoolean.current = true;
    navigate(`${lastVisited}`);
    // dispatch(handleMiniPLayer(true));
  };

  const handleKeyUp = (e) => {
    const isInputField = e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA";
    if (isInputField) return;
    if (isFetching) return;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    const key = e.key.toLowerCase();

    if (key === "i") {
      if (!miniPlayer && !window.location.pathname.includes("watch")) return;
      timeoutRef.current = setTimeout(() => {
        if (!miniPlayer) {
          handleMiniPlayerNavigation();
          if (settingsShowing) {
            handleSettingsShowing();
          }
        } else {
          navigate(`/watch?v=${video_id}`);
        }
      }, 130);
    } else if (key === "c") {
      if (!captions_url) return;
      dispatch(toggleCaptions(playerRef, captions_url[0].url, captions_url[0].language));
      dispatch(handleTranslatingHere(null, currentPanel, currentPanel));
    }
  };
  useLayoutEffect(() => {
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [miniPlayer, lastVisited, isFetching, currentPanel, video_id, miniPlayerBoolean, settingsShowing]);

  const removeSettingsOnoutsideClick = (e) => {
    const element = e.target;

    if (!element.classList.contains("settings") && !element.closest(".settings") && !element.classList.contains("cog")) {
      const settings = document.querySelector(".settings");
      const settingsClickRegion = document.querySelector(".settings-clikcregion");
      settings.classList.remove("show");
      settingsClickRegion.classList.remove("show");
      document.removeEventListener("click", removeSettingsOnoutsideClick);
      dispatch(updateSettingsShowing(false));
      setTimeout(() => {
        dispatch(handleTranslating(null, currentPanel, "settings-menu-selector-items"));
      }, 210);
      handleMouseOut();
    }
  };

  const handleSettingsShowing = () => {
    if (miniPlayerBoolean) return;
    dispatch(handleTranslatingHere(null, currentPanel, "settings-menu-selector-items"));
    if (settingsShowing) {
      document.removeEventListener("click", removeSettingsOnoutsideClick);
    } else {
      document.addEventListener("click", removeSettingsOnoutsideClick);
    }
    const settings = document.querySelector(".settings");
    const settingsClickRegion = document.querySelector(".settings-clikcregion");
    settingsClickRegion.classList.toggle("show");
    settings.classList.toggle("show");
    dispatch(updateSettingsShowing(!settingsShowing));
  };

  return (
    <div className='bottom-controls-right'>
      <button
        type='button'
        className={`player-button captions ${captions_url ? "has-captions" : ""}`}
        ref={captionsRef}
        onFocus={handleMouseMove}
        onClick={() => {
          if (!captions_url) return;
          dispatch(toggleCaptions(playerRef, captions_url[0].url, captions_url[0].language));
        }}
      >
        <CaptionsButton />
      </button>
      <button type='button' className='player-button cog' onFocus={handleMouseMove} onClick={handleSettingsShowing}>
        <CogButton />
      </button>
      {!fullScreen && (
        <>
          <button type='button' className='player-button miniplayer' onClick={handleMiniPlayerNavigation} onFocus={handleMouseMove}>
            <MiniPlayerButton />
          </button>
          <button
            type='button'
            className='player-button theatre-normal'
            onClick={() => dispatch(handleTheatre(theatreMode))}
            onFocus={handleMouseMove}
          >
            <TheatreNormalButton />
          </button>
        </>
      )}
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
