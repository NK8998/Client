import { ForwardButton, PlayPauseButton } from "../../../../../../assets/icons";
import { usePlayerMouseMove } from "../../../utilities/player-mouse-interactions";
import VolumeSlider from "./slider";

export const BottomControlsLeft = ({ handlePlayState }) => {
  const [handleMouseMove] = usePlayerMouseMove();
  const handleMouseLeaveControlsLeft = (e) => {
    const volumeForm = document.querySelector(".volume-slider");
    volumeForm.classList.remove("show");
  };
  return (
    <div className='bottom-controls-left' onMouseLeave={handleMouseLeaveControlsLeft}>
      <button type='button' className={`player-button play-pause`} onClick={handlePlayState} onFocus={handleMouseMove}>
        <PlayPauseButton />
      </button>
      <button type='button' className='player-button forward' onFocus={handleMouseMove}>
        <ForwardButton />
      </button>
      <VolumeSlider handleFocus={handleMouseMove} />
    </div>
  );
};
