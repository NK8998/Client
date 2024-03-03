import * as Slider from "@radix-ui/react-slider";
import { usePlayerMouseMove } from "../../utilities/player-mouse-interactions";
import { useRef, useState } from "react";
import { VolumeHighButton, VolumeLowButton, VolumeMuteButton } from "../../../../assets/icons";

export default function VolumeSlider({ handleFocus }) {
  const [handleMouseMove] = usePlayerMouseMove();
  const [volume, setVolume] = useState(1);
  const hoveringRef = useRef();
  const hanldeValueChange = (value) => {
    const videoRef = document.querySelector("#html5-player");
    if (!videoRef) return;
    handleMouseMove();
    const volume = value[0] / 100;
    setVolume(volume);
    videoRef.volume = volume;
  };

  let volumeIcon = <></>;
  if (volume >= 0.5) {
    volumeIcon = <VolumeHighButton />;
  } else if (volume < 0.5 && volume > 0) {
    volumeIcon = <VolumeLowButton />;
  } else if (volume === 0) {
    volumeIcon = <VolumeMuteButton />;
  }

  const handleMouseEnter = () => {
    handleFocus();
    hoveringRef.current = true;
    const volumeForm = document.querySelector(".volume-slider");
    volumeForm.classList.add("show");
  };
  const handleMouseLeavePlayerButton = () => {
    hoveringRef.current = false;
  };
  const handleBlur = (e) => {
    if (hoveringRef.current === true) return;
    const volumeForm = document.querySelector(".volume-slider");
    volumeForm.classList.remove("show");
  };

  return (
    <>
      <button
        type='button'
        className='player-button volume'
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeavePlayerButton}
        onFocus={handleFocus}
      >
        {volumeIcon}
      </button>
      <form className='volume-slider player-button' tabIndex={0} onFocus={handleMouseEnter} onBlur={handleBlur}>
        <Slider.Root className='SliderRoot' defaultValue={[100]} max={100} min={0} step={1} onValueChange={hanldeValueChange}>
          <Slider.Track className='SliderTrack'>
            <Slider.Range className='SliderRange' />
          </Slider.Track>
          <Slider.Thumb className='SliderThumb' aria-label='Volume' />
        </Slider.Root>
      </form>
    </>
  );
}
