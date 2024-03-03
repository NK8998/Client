import { useDispatch, useSelector } from "react-redux";
import { ForwardButton, FullscreenButton, MiniPlayerButton, PlayPauseButton, SmallScreenButton, TheatreNormalButton } from "../../../../assets/icons";
import { handleFullscreen, handleMiniPLayer, handleTheatre } from "../../../../store/Slices/watch-slice";
import { useLayoutEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./bottom-controls.css";
import VolumeSlider from "./slider";
import { usePlayerMouseMove } from "../../utilities/player-mouse-interactions";

export default function BottomControls({ handlePlayState, miniPlayerBoolean }) {
  const fullScreen = useSelector((state) => state.watch.fullScreen);
  const theatreMode = useSelector((state) => state.watch.theatreMode);
  const miniPlayer = useSelector((state) => state.watch.miniPlayer);
  const playingVideo = useSelector((state) => state.watch.playingVideo);
  const locationsArr = useSelector((state) => state.app.locationsArr);
  const isFetching = useSelector((state) => state.app.isFetching);
  const [handleMouseMove] = usePlayerMouseMove();
  const { videoId } = playingVideo;
  const timeoutRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleFocus = () => {
    handleMouseMove();
  };
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
          navigate(`/watch?v=${videoId}`);
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

  const handleMouseLeaveControlsLeft = (e) => {
    const volumeForm = document.querySelector(".volume-slider");
    volumeForm.classList.remove("show");
  };

  return (
    <div className='bottom-controls'>
      <div className='bottom-controls-left' onMouseLeave={handleMouseLeaveControlsLeft}>
        <button type='button' className={`player-button play-pause`} onClick={handlePlayState} onFocus={handleFocus}>
          <PlayPauseButton />
        </button>
        <button type='button' className='player-button forward' onFocus={handleFocus}>
          <ForwardButton />
        </button>
        <VolumeSlider handleFocus={handleFocus} />
      </div>
      <div className='bottom-controls-right'>
        <button type='button' className='player-button miniplayer' onClick={handleMiniPlayerNavigation} onFocus={handleFocus}>
          <MiniPlayerButton />
        </button>
        <button type='button' className='player-button theatre-normal' onClick={() => dispatch(handleTheatre(theatreMode))} onFocus={handleFocus}>
          <TheatreNormalButton />
        </button>
        <button
          type='button'
          className='player-button fullscreen-normal'
          onClick={() => dispatch(handleFullscreen(fullScreen))}
          onFocus={handleFocus}
        >
          {fullScreen ? <SmallScreenButton /> : <FullscreenButton />}
        </button>
      </div>
    </div>
  );
}
