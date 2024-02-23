import { useDispatch } from "react-redux";
import { PlayPauseButton, TheatreNormalButton } from "../../../../assets/icons";
import { toggleTheatreMode } from "../../../../store/Slices/watch-slice";

export default function BottomControls({ handlePlayState }) {
  const dispatch = useDispatch();
  return (
    <div className='bottom-controls'>
      <div className='bottom-controls-left'>
        <button type='button' className={`player-button`} onClick={handlePlayState}>
          <PlayPauseButton />
        </button>
      </div>
      <div className='bottom-controls-right'>
        <button
          type='button'
          className='player-button'
          onClick={() => {
            dispatch(toggleTheatreMode());
          }}
        >
          <TheatreNormalButton />
        </button>
      </div>
    </div>
  );
}
