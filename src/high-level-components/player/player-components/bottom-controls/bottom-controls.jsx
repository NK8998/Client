import { useDispatch, useSelector } from "react-redux";
import { FullscreenButton, MiniPlayerButton, PlayPauseButton, SmallScreenButton, TheatreNormalButton } from "../../../../assets/icons";
import { handleFullscreen, handleMiniPLayer, handleTheatre } from "../../../../store/Slices/watch-slice";
import { useLayoutEffect } from "react";
import { handleFocusingElements } from "../../utilities/player-progressBar-logic";
import { useNavigate } from "react-router-dom";

export default function BottomControls({ handlePlayState, handleMouseMove, miniPlayerBoolean }) {
  const fullScreen = useSelector((state) => state.watch.fullScreen);
  const theatreMode = useSelector((state) => state.watch.theatreMode);
  const miniPlayer = useSelector((state) => state.watch.miniPlayer);
  const playingVideo = useSelector((state) => state.watch.playingVideo);
  const locationsArr = useSelector((state) => state.app.locationsArr);
  const { videoId } = playingVideo;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleFocus = () => {
    handleMouseMove();
  };
  const handleMiniPlayerNavigation = () => {
    miniPlayerBoolean.current = true;
    const nonWatchRoute = locationsArr.slice().find((path) => !path.includes("/watch")) || "/";
    console.log(nonWatchRoute);
    navigate(`${nonWatchRoute}`);
    dispatch(handleMiniPLayer(true));
  };

  const handleKeyUp = (e) => {
    const key = e.key.toLowerCase();

    if (key === "i") {
      if (!miniPlayer) {
        handleMiniPlayerNavigation();
      } else {
        navigate(`/watch?v=${videoId}`);
      }
    }
  };
  useLayoutEffect(() => {
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [miniPlayer, locationsArr]);

  return (
    <div className='bottom-controls'>
      <div className='bottom-controls-left'>
        <button type='button' className={`player-button play-pause`} onClick={handlePlayState} onFocus={handleFocus}>
          <PlayPauseButton />
        </button>
      </div>
      <div className='bottom-controls-right'>
        <button type='button' className='player-button miniplayer' onClick={handleMiniPlayerNavigation}>
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
