import { useDispatch, useSelector } from "react-redux";
import { FullscreenButton, PlayPauseButton, SmallScreenButton, TheatreNormalButton } from "../../../../assets/icons";
import { handleFullscreen, handleTheatre } from "../../../../store/Slices/watch-slice";

export default function BottomControls({ handlePlayState }) {
  const fullScreen = useSelector((state) => state.watch.fullScreen);
  const theatreMode = useSelector((state) => state.watch.theatreMode);
  const dispatch = useDispatch();

  return (
    <div className='bottom-controls'>
      <div className='bottom-controls-left'>
        <button type='button' className={`player-button`} onClick={handlePlayState}>
          <PlayPauseButton />
        </button>
      </div>
      <div className='bottom-controls-right'>
        <button type='button' className='player-button' onClick={() => dispatch(handleTheatre(theatreMode))}>
          <TheatreNormalButton />
        </button>
        <button type='button' className='player-button' onClick={() => dispatch(handleFullscreen(fullScreen))}>
          {fullScreen ? <SmallScreenButton /> : <FullscreenButton />}
        </button>
      </div>
    </div>
  );
}
